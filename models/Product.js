const db = require('../modules/connect-db')

class Product {
    constructor(data={}){
        const defaultData = {
            author: '',
            bookname: '', 
            category_sid: 4,
            book_id: '', 
            publish_date: '1970-01-01', 
            pages: 0, 
            price: 0, 
            isbn: '', 
            on_sale: 1, 
            introduction: ''
        }
        this.data = {...defaultData, ...data};
    }

    async save(){
        const [result] = await db.query('INSERT INTO `products` SET ?', [this.data])
        return {
            success: !! result.insertId,
            insertId: result.insertId,
            instance: this,
        };
    }

    async update(modify={}){
        // 拿取剛剛findOne那邊的sid 作為這裡的pk
        const pk = this.data.sid;
        if(!pk){
            return {success: false}
        }
        const data = {...this.data, ...modify};
        // 刪除sid避免等等寫入sql語法會干擾
        deletedata.sid;

        const [result] = await db.query(`UPDATE products SET ? WHERE sid=?`,
        [data, pk]);
        console.log(result);
        return {success: !!result.affectedRows};
    }

    static async findOne(pk){
        pk = parseInt(pk);

        if(isNaN(pk) || !pk){
            // throw new Error('沒有主鍵');

            return null;
        }

        const [rs] = await db.query(`SELECT * FROM products WHERE sid=${pk}`)

        if(! rs.length){
            return null;
        }

        return new Product({...rs[0]});
    }
}

module.exports = Product;



