require('dotenv').config();
const express = require('express')
const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home', { name: 'Ashley' })
})

app.get('/json-sales', (req, res) => {
    const sales = require('./data/sales.json')
    
    const col = req.query.orderByCol;
    const rule = req.query.orderByRule;
    console.log(col, rule);
    
    res.render('json-sales', {sales})
})

app.use((req, res) => {
    res.status(404);
    res.send('<p>Page Not Found 404</p>')
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server started: ${port} - `, new Date());
});