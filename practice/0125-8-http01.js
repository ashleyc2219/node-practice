const http = require('http');

const server = http.createServer((req, res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html'
    });
    res.write('<div>res.write</div>');
    res.end(`<p>res.end</p>
            <p>${req.url}</p>`)
})

server.listen(3000)