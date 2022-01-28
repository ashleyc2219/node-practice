const http = require('http');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

function writeData(req, res) {
    return new Promise((resolve, reject) => {
        fs.writeFile('headers.txt', JSON.stringify(req.headers, null, 4), error => {
            if (error) {
                reject('failed')
            } else {
                resolve({
                    "msg": "success",
                    "filePath": __dirname + '/headers.txt',
                })
            }
        });

    })
}
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf8"
    })
    writeData(req, res)
        .then((obj) => {
            res.write('writeFile: ' + obj.msg);
            return (obj.filePath)
        }).then((r) => {
            fs.readFile(r, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(data)
                }
            });
        }).then((msg) => {
            console.log(msg.toString());
            res.end(msg)
        }).catch((msg) => {
            res.end(msg)
        })
})

server.listen(3000)