require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const session = require('express-session');
// require express-mysqlsession，用session設定一些數據
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const db = require('./modules/connect-db');
// 設定session儲存的地方，用現有的連線
const sessionStore = new MysqlStore({}, db);
// 如果用sessionStore 建立連線，就要另外用options 設定連線數據
// const sessionStore = new MySQLStore(options);
const app = express();
const multer = require('multer');
const upload = require(__dirname + '/modules/upload-images');
// cors 跨源請求
const cors = require('cors');
// node fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// require axios
const axios = require('axios');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.set('view engine', 'ejs')

// Top-level middleware
// 設定白名單，允許跨源
const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        console.log({origin});
        cb(null, true);
    }
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use('/joi',express.static('node_modules/joi/dist'))

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'adskfjla',
    store: sessionStore,
    cookie: {
        maxAge: 1200000
    }
}))
// 自訂的 頂層 middleware
app.use((req, res, next)=>{
    res.locals.shin = '哈囉';
    // res.send('oooo'); // 回應之後, 不會往下個路由規則

    // template helper functions 樣版輔助函式
    res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
    res.locals.toDatetimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');

    // 如果有 token 就解析(驗證)完放在 res.locals.auth
    res.locals.auth = null;
    let auth = req.get('Authorization');  // 自訂的變數, 設定有沒有身份驗證, 預設值為 null
    console.log({auth})
    if(auth && auth.indexOf('Bearer ')===0){
        auth = auth.slice(7);
        // 避免如果遇到假token，會讓整個程式爛掉
        console.log({auth, k: process.env.JWT_KEY})
        try{
            const payload = jwt.verify(auth, process.env.JWT_KEY);
            res.locals.auth = payload;
            console.log({payload})
        }catch(ex){
            console.log({ex})
        }
    }


    // 前往下一個中介軟體
    next();
});
app.get('/', function (req, res) {
    res.render('home', { name: 'Ashley' })
})
// 上傳檔案
app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    res.json(req.file)
})

app.post('/try-uploads', upload.array('photos'), async (req, res) => {
    const result = req.files.map(el => {
        return {
            mimetype: el.mimetype,
            filename: el.filename,
            size: el.size,
        }
    });
    res.json(result)

})
app.use('/address-book',  require('./routes/address-book') );
// 登入的表單
app.get('/login', async (req, res)=>{
    res.render('login');
});
// 檢查登入帳密
app.post('/login', async (req, res)=>{
    const output = {
        success: false,
        error: '',
        info: null,
        token: '',
        code: 0,
    };
    

    const [rs] = await db.query('SELECT admin_id, admin_name, admin_pass, nickname, avatar FROM admin WHERE admin_name=?', [req.body.account]);

    if(! rs.length){
        output.error = '帳密錯誤';
        output.code = 401;
        return res.json(output);
    }
    const row = rs[0];

    const compareResult = await bcrypt.compare(req.body.password, row.admin_pass);
    if(! compareResult){
        output.error = '帳密錯誤';
        output.code = 402;
        return res.json(output);
    }

    const {admin_id, admin_name, admin_pass, nickname, avatar} = row;
    output.success = true;
    output.info = {admin_name, avatar, nickname};
    output.token = jwt.sign({admin_id, admin_name}, process.env.JWT_KEY);
    res.json(output);
});
app.use('/admin',  require('./routes/admin') );

app.get('/try-session', (req, res) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json(req.session);
})

app.get('/try-moment', (req, res) => {
    // 定義時間格式
    const fm = 'YYYY/MM/DD HH:mm:ss';
    res.json({
        // 取得現在時間、設定時間格式
        mo1: moment().format(fm),
        // 設定時區
        mo2: moment().tz('Europe/London').format(fm),
        // 取得session過期時間，
        mo3: moment(req.session.cookie.expires).format(fm),
        mo4: moment(req.session.cookie.expires).tz('Europe/London').format(fm),
    })
})

app.get('/try-connectdb', async (req, res) => {
    const sql = "SELECT * FROM product_sake LIMIT 5";
    const [results, fields] = await db.query(sql);
    res.json(results)
})

app.get('/yahoo', async (req, res)=>{
    fetch('https://tw.yahoo.com/')
        .then(r=>r.text())
        .then(txt=>{
            res.send(txt);
        });
});

// 使用axios
app.get('/yahoo2', async (req, res)=>{
    const response = await axios.get('https://tw.yahoo.com/');
    console.log(response);
    res.send(response.data);
});

app.use((req, res) => {
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server started: ${port} - `, new Date());
});