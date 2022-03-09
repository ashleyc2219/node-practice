const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-images')

const router = express.Router();

async function getListData(req, res) {
    const perPage = 7;
    // 取得query string現在所在的頁數
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

// 呼叫授權api
router.get('/api/auth-list', async(req, res)=>{
    console.log("ab\n", res.locals.auth)
    if(res.locals.auth && res.locals.auth.admin_name){
        return res.json({...await getListData(req, res), account: res.locals.auth.admin_name}); // 正常送出資料
    }else{
        res.json({success: false, error: '沒有授權'})
    }
})
// 導向新增資料的頁面
router.get('/add', (req, res) => {
    res.render('address-book/add');
});
// 用multer(upload中介軟體)去處理multipart/form-data
router.post('/add2', upload.none(), async (req, res)=>{
    res.json(req.body);
});
// 處裡下面兩種類型的資料
// application/x-www-form-urlencoded
// application/json
router.post('/add', async(req, res)=>{
    const output = {
        success: false,
        error: ''
    };
    // const sql = "INSERT INTO `product_sake` SET ?";
    // const obj = {...req.body, pro_creat_time: new Date()};
    // const [result] = await db.query(sql, [obj]);
    // console.log(result);
    // res.json(result)

    const sql = "INSERT INTO `product_sake`(`pro_name`, `pro_stock`, `pro_intro`, `pro_condition`, `pro_creat_time`) VALUES (?, ?, ?, ?, NOW())";
    // result 需用[]包起來，因為回傳值是array，可以參照array 接值 補充
    const [result] = await db.query(sql, [
        req.body.pro_name,
        req.body.pro_stock,
        req.body.pro_intro,
        req.body.pro_condition
    ]);
    console.log(result);
    output.success = !! result.affectedRows;
    output.result = result;
    // console.log(output);

    res.json(output)
})

// 刪除功能
//  /:pro_id、req.params.pro_id 是一組的
router.get('/delete/:pro_id', async (req,res)=>{
    const sql = "DELETE FROM `product_sake` WHERE `pro_id`=?";
    const [result] = await db.query(sql, [req.params.pro_id]);
    if(! result.length){
        return res.redirect('/address-book/list');
    }

    res.render('address-book/edit', result[0]);
})

// 編輯功能
router.get('/edit/:pro_id', async(req, res)=>{
    const sql = "SELECT * FROM `product_sake` WHERE `pro_id`=?";
    const [result] = await db.query(sql, [req.params.pro_id]);

    if(! result.length){
        return res.redirect('/address-book/list');
    }

    res.render('address-book/edit', result[0]);
})
router.post('/edit/:pro_id', async(req, res)=>{
    const output = {
        success: false, 
        error: ''
    };
    const sql = "UPDATE `product_sake` SET ? WHERE `pro_id`=?";
    const [result] = await db.query(sql, [req.body, req.params.pro_id]);

    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;

    res.json(output);
})
module.exports = router;