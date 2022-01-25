// 用一個變數去接return的object
// 之後用obj.Person, obj.f3()的方式，使用單一物件
const obj = require('./0125-4-person');

// 展開設定
const {Person} = require('./0125-4-person');

const p2 = new obj.Person('Peter', 25);
const p3 = new Person('David', 30);

console.log(p2);
console.log(obj.f3(3));
console.log(p3);
// 兩個指向同一個資源、物件
console.log(obj.Person === Person);