console.log(process.env.NODE_ENV)
// require .env 檔案進來取得環境變數的設定
require('dotenv').config();
const express = require('express')


// 建立webserver 物件
const app = express();

// 使用資料夾內的檔案
app.use(express.static('public'))

// 定義路由，指定用get的方式 (post不行)
// 透過路由指定呈現的內容
app.get('/', function(req, res){
    // express 提供的方法會自動設定檔頭
    res.send('<p>Hello express</p>')
})
// use 可以接收所有的方法 (get, post...)
// 必須放在所有的路由之後
app.use((req, res)=>{
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

// 偵聽port 3000的server
const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`server started: ${port} - `, new Date());
});