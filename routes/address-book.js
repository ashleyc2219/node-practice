const express = require('express');
const db = require('./../modules/connect-db');

const router = express.Router();

async function getListData(req, res) {
    const perPage = 7;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let search = req.query.search ? (req.query.search).trim() : '';

    // 要傳到ejs的條件，能作為搜尋結果的頁碼
    let conditions = {};

    // 搜尋功能 用sql語法去搜尋
    let sqlWhere = ' WHERE 1';
    if (search) {
        // escape 是 module mysql2的功能，會針對sql語法去跳脫字元
        sqlWhere = ` WHERE \`pro_name\` LIKE ${db.escape('%' + search + '%')} `;
        conditions.search = search;
    }
    // 除錯用，確定sql語法
    // res.json(sqlWhere); 

    // 輸出資料，會傳到ejs
    const output = {
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        // 新增conditions 才能把搜尋的傳到ejs
        conditions
    };
    // sql的程式碼，得知該資料表有幾筆資料，num是幫欄位取名字
    const t_sql = "SELECT COUNT(1) num FROM product_sake";
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    // 若在query string 輸入<1的頁數，就會跳轉
    if (page < 1) {
        return res.redirect(`/address-book/list`);
    }
    if (totalRows) {
        output.totalPages = Math.ceil(totalRows / perPage);
        output.totalRows = totalRows;
        // 呈現該頁的資料
        // limit a, b - a: 起始資料的index、b: 從a資料向後呈現幾筆，
        const sql = `SELECT * FROM product_sake ${sqlWhere} LIMIT ${perPage * (page - 1)}, ${perPage}`;
        const [rs2] = await db.query(sql);
        rs2.forEach(el => [
            el.pro_creat_time = res.locals.toDateString(el.pro_creat_time)
        ])
        output.rows = rs2;

    }
    return (output)
};

// 將拿取資料寫成一個function 可以重複使用，拿去渲染不同模式的頁面
router.get('/list', async (req, res) => {
    res.render('address-book/list', await getListData(req, res));
})
router.get('/api/list', async (req, res) => {
    res.json(await getListData(req, res))
})
// 導向新增資料的頁面
router.get('/add', (req, res) => {
    res.render('address-book/add');
});
router.post('/add', async (req, res)=>{
    
});
module.exports = router;