const express = require('express');
const db = require('./../modules/connect-db');

const router = express.Router();

 async function getListData(req, res){
    // 每頁呈現幾筆資料
    const perPage = 5;
    // 用req.query去得知，用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    
    // 輸出在頁面上的資料
    const output = {
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows:[]
    };
    // sql的程式碼，得知該資料表有幾筆資料，num是幫欄位取名字
    const t_sql = "SELECT COUNT(1) num FROM product_sake";
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    if (page < 1) {
        return res.redirect(`/address-book/list`);
    }
    if(totalRows){
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;
        // 呈現該頁的資料
        // limit a, b - a: 起始資料的index、b: 從a資料向後呈現幾筆，
        const sql = `SELECT * FROM product_sake LIMIT ${perPage*(page-1)}, ${perPage}`;
        const [rs2] = await db.query(sql);
        rs2.forEach(el=>[
            el.pro_creat_time = res.locals.toDateString(el.pro_creat_time)
        ])
        output.rows = rs2;
        
    }
    return(output)
};

router.get('/list', async (req, res)=>{
    res.render('address-book/list', await getListData(req, res));
})
router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res))
})

module.exports = router;