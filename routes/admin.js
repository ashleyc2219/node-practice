const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-images')

const router = express.Router();

// 送資料給前端
router.get('/myform/:sid', async(req, res)=>{
    const sid = parseInt(req.params.sid) || 0;
    const [rs] = await db.query(`SELECT * FROM admin WHERE admin_id =${sid}`);
    res.json(rs)});

router.put('/myform/:sid', upload.single('avatar'), async(req, res)=>{
    let modifyAvatar = '';
    if(req.file && req.file.filename){
        modifyAvatar = `, avatar='${req.file.filename}'`;
    }
    const sql = `UPDATE admin SET nickname=? ${modifyAvatar}  WHERE admin_id=?`;
    console.log(sql)

    const result = await db.query(sql, [req.body.nickname, req.params.sid]);
});


module.exports = router