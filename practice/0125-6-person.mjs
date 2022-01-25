class Person {
    constructor(name='noname', age=0) {
        this.name = name;
        this.age = age;
    }
    sayHello(){
        return `Hello ${this.name}`;
    }
}

console.log('person.js');

// mjs 匯出defualt 以外的多個物件
const f1 = b => b*b;
const f3 = a => a*a*a;
export {f1, f3}; 


// mjs匯出defualt物件
export default Person