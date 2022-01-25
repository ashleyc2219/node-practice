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
                resolve('success!')
            }
        });

    })
}

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf8"
    })
    writeData(req, res)
        .then((msg) => {
            res.write('writeFile: ' + msg)
        }).then(() => {
            fs.readFile('./headers.txt', (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    res.end(data)
                }
            });
        })
})

server.listen(3000)