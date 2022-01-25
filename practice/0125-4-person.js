class Person {
    constructor(name = 'noname', age = 0) {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        return {
            name: this.name,
            age: this.age,
        }
    }
    sayHello() {
        return `Hello ${this.name}`;
    }
}

console.log('person.js');

const f3 = a => a * a * a;

// 用object匯出多個物件
module.exports = { Person, f3 };