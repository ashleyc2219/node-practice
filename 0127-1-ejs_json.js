require('dotenv').config();
const express = require('express')
const app = express();

// 註冊樣版引擎
// 使用預設的views 資料夾
app.set('view engine', 'ejs')
app.use(express.static('public'))

// 使用樣板引擎render指定檔案
app.get('/', function(req, res){
    res.render('home', {name: 'Ashley'})
})

app.get('/json-sales', (req,res)=>{
    const sales = require('./data/sales.json')
    console.log(sales);
    res.render('json-sales', {sales})
})

app.use((req, res)=>{
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`server started: ${port} - `, new Date());
});