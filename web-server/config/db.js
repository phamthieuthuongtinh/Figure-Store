require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Kết nối SQL Server thành công');
        return pool;
    })
    .catch(err => {
        console.error('Lỗi kết nối SQL:', err);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};
