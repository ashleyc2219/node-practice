class Person{
    constructor(name = 'noname', age = 0){
        this.name = name,
        this.age = age
    }

    toJSON(){
        return{
            name: this.name,
            age: this.age
        }
    }

    sayHello(){
        return `Hello ${this.name}`;
    }

}

const p1 = new Person('Bobby', 25)

console.log(p1.sayHello());
console.log(JSON.stringify(p1));
console.log(JSON.stringify(p1.toJSON()));