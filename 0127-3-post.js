require('dotenv').config();
const express = require('express')
const app = express();

app.set('view engine', 'ejs')
// Top-level middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home', { name: 'Ashley' })
})

app.get('/json-sales', (req, res) => {
    const sales = require('./data/sales.json')

    res.render('json-sales', { sales })

    const col = req.query.orderByCol;
    const rule = req.query.orderByRule;
    console.log(col, rule);
})
app.get('/try-qs', (req, res) => {
    res.json(req.query);
});

app.post('/try-post', (req, res) => {
    res.json(req.body)
})

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form')
})
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body)
})

app.use((req, res) => {
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server started: ${port} - `, new Date());
});