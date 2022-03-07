const jwt = require('jsonwebtoken')

let token = jwt.sign({name: 'Ashley', gender: 'female'}, 'shhhh')

console.log(token);

let decoded = jwt.verify(token, 'shhhh')

console.log(decoded);