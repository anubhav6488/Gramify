var mysql = require('mysql');
var util = require('util');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

var pool = mysql.createPool({
    connectionLimit: stage.mysql_connection_limit,
    host: stage.mysql_connection_host,
    user: stage.mysql_user,
    password: stage.mysql_password,
    database: stage.mysql_database,
    port: stage.mysql_port,
    timezone: stage.mysql_timezone
});

pool.getConnection(function (err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    } else {
        // console.log("Database Connected Successfully");
        pool.beginTransaction = connection.beginTransaction;
        pool.rollback = connection.rollback;
        pool.commit = connection.commit;
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool;
