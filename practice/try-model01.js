const Product = require('./../models/Product');

// 因為是類別，所以要新增一個個體
const p1 = new Product({author:'david', bookname:'教你如何看一本書'});

p1.save().then(r=>{
    console.log(p1);
    // 在node中使用promise要設定停止時機
    process.exit();
});
