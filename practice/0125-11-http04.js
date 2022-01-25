const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    fs.writeFile('headers2.txt', JSON.stringify(req.headers), error => {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        if (error) {
            response.end('write 錯誤');
        } else {
            fs.readFile(__dirname + '/headers.txt', (error, data) => {
                if (error) {
                    console.log(error);

                    res.end('read 錯誤')
                } else {
                    res.write('寫入資料')
                    res.end(data)
                }
            })
        }
    });



})

server.listen(3000)