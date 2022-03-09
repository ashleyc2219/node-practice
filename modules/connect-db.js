const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_user || 'root',
    password: '',
    database: 'mfee23',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

module.exports = pool.promise()