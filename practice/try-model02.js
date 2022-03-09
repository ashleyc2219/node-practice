const Product = require('./../models/Product');

let p2;
(async ()=>{
    p2 = await Product.findOne(2);
    console.log(p2);
    process.exit();
})();