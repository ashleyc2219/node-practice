const Product = require('./../models/Product');

let p2;
(async ()=>{
    // 讀取
    p2 = await Product.findOne(2);
    console.log(p2);

    // 修改
    const r = await p2.update({author:'林小明'})
    console.log(r);
    process.exit();
})();