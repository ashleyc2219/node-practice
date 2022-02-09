const Joi = require('joi');

// 類似資料的結構
// 後端才可以用required的功能
const schema = Joi.object({
    username: Joi.string().alphanum().min(6).max(20).required(),

    age: Joi.number().required(),
});
// 會自動把string的數字轉成number
console.log(schema.validate({username: 'emily', age: '29'}));