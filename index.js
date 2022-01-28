require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const app = express();
// require multer
const multer = require('multer');
// 指定暫存資料夾的位置
// const upload = multer({ dest: 'tmp_uploads/' })
const upload = require(__dirname + '/modules/upload-images');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home', { name: 'Ashley' })
})
// 上傳檔案
app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    res.json(req.file)
})

app.post('/try-uploads', upload.array('photos'), async(req, res)=>{
    const result = req.files.map(el => {
        return {
            mimetype: el.mimetype,
            filename: el.filename,
            size: el.size,
        }
    });
    res.json(result)
    
})

app.use((req, res) => {
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server started: ${port} - `, new Date());
});