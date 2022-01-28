require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const app = express();
// require multer
const multer = require('multer');
// 指定暫存資料夾的位置
const upload = multer({ dest: 'tmp_uploads/' })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home', { name: 'Ashley' })
})
// 上傳檔案
app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    const file = req.file;
    const types = ['image/jpeg', 'image/png'];
    if (file && file.originalname) {
        if (types.includes(file.mimetype)) {
            await fs.rename(file.path, __dirname + '/public/img/' + file.originalname);
            return res.redirect('/img/' + file.originalname)
        }
    }
    res.end('finger cross!')
})

app.use((req, res) => {
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server started: ${port} - `, new Date());
});