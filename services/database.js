
var pool = require('../connections/mysql');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];
const jwt = require('jsonwebtoken');
const secret = stage.JWT_SECRET;
var nodemailer = require('nodemailer');
const http = require('http');
const https = require('https');
var qs = require("querystring");
var aes256 = require('aes256');
var crypto = require('crypto');
var async = require('async')
// const admin = require("firebase-admin");
// const serviceAccount = require('../keys/' + stage.private_key_path);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: stage.databaseURL
// });

let CONSTANTS = require('../lib/constants');

// Setup for mailing
const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    auth: {
        user: stage.email,
        pass: stage.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

let self = module.exports = {
    is_exist: async function (query) {
        return new Promise((resolve, reject) => {
            try {
                let exist_query = `SELECT EXISTS(` + query + `) as 'EXISTS'`
                pool.query(exist_query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(results[0].EXISTS);
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        })
    },
    insert: async function (query) {
        return new Promise((resolve, reject) => {
            try {
                pool.query(query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        let response = {
                            code: 500,
                            result: err
                        }
                        reject(response)
                    } else {
                        let response = {
                            code: 200,
                            result: results.insertId
                        }
                        resolve(response);
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        })
    },
    update: async function (query) {
        return new Promise((resolve, reject) => {
            try {
                pool.query(query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        let response = {
                            code: 500,
                            result: err
                        }
                        reject(response)
                    } else {
                        let response = {
                            code: 200,
                            result: results
                        }
                        resolve(response);
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        })
    },
    fetch: async function (query) {
        return new Promise((resolve, reject) => {
            try {
                pool.query(query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        let response = {
                            code: 500,
                            result: err
                        }
                        reject(response)
                    } else {
                        let response = {
                            code: 200,
                            result: results
                        }
                        resolve(response);
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        })
    },
    fetch_array: async function (query) {
        return new Promise((resolve, reject) => {
            try {
                pool.query(query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        resolve([])
                    } else {
                        resolve(results);
                    }
                })
            }
            catch (e) {
                resolve([]);
            }
        })
    },
    delete: async function (query) {
        return new Promise((resolve, reject) => {
            try {
                pool.query(query, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        let response = {
                            code: 500,
                            result: err
                        }
                        reject(response)
                    } else {
                        let response = {
                            code: 200,
                            result: results
                        }
                        resolve(response);
                    }
                })
            }
            catch (e) {
                console.log(e)
                reject(e)
            }
        })
    },
    transaction: async function (queries) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof queries === 'object' && queries.length > 0) {

                    pool.getConnection((err, connection) => {
                        if (err) {
                            let response = {
                                result: err,
                                code: 500
                            }
                            reject(response)
                        } else {
                            connection.beginTransaction((err) => {
                                if (err) {
                                    console.log(err)
                                    connection.release();;
                                    let response = {
                                        result: err,
                                        code: 500
                                    }
                                    reject(response)
                                } else {

                                    async.eachSeries(queries, async function iterateValues(element, callback) {
                                        try {
                                            connection.query(element, (err, result, fields) => {
                                                if (err) {
                                                    console.log(err)
                                                    connection.rollback()
                                                    connection.release();
                                                    let response = {
                                                        result: err,
                                                        code: 500
                                                    }
                                                    reject(response)
                                                } else {
                                                    if (element === queries[queries.length - 1]) {
                                                        connection.commit((err) => {
                                                            if (err) {
                                                                console.log(err)
                                                                let response = {
                                                                    result: err,
                                                                    code: 500
                                                                }
                                                                reject(response)
                                                            } else {
                                                                let response = {
                                                                    result: result,
                                                                    code: 200
                                                                }
                                                                resolve(response)
                                                            }
                                                        })
                                                    }
                                                    callback
                                                }
                                            });
                                        } catch (e) {
                                            console.log(e)
                                            reject(e)
                                        }
                                    })
                                }
                            })
                        }
                    })

                } else {
                    let response = {
                        code: 200,
                        result: results
                    }
                    resolve(response);
                }
            }
            catch (e) {
                console.log(e)
                reject(e)
            }
        })
    },
    data_transaction: async function (queries) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof queries === 'object' && queries.length > 0) {

                    pool.getConnection((err, connection) => {
                        if (err) {
                            let response = {
                                result: err,
                                code: 500
                            }
                            reject(response)
                        } else {
                            connection.beginTransaction((err) => {
                                if (err) {
                                    console.log(err)
                                    connection.release();;
                                    let response = {
                                        result: err,
                                        code: 500
                                    }
                                    reject(response)
                                } else {


                                    async.eachSeries(queries, async function iterateValues(element, callback) {
                                        try {

                                            connection.query(element[0], [element[1]], (err, result, fields) => {
                                                if (err) {
                                                    console.log(err)
                                                    connection.rollback()
                                                    connection.release();
                                                    let response = {
                                                        result: err,
                                                        code: 500
                                                    }
                                                    reject(response)
                                                } else {
                                                    if (element === queries[queries.length - 1]) {
                                                        connection.commit((err) => {
                                                            if (err) {
                                                                console.log(err)
                                                                let response = {
                                                                    result: err,
                                                                    code: 500
                                                                }
                                                                reject(response)
                                                            } else {
                                                                let response = {
                                                                    result: result,
                                                                    code: 200
                                                                }
                                                                resolve(response)
                                                            }
                                                        })
                                                    }
                                                    callback
                                                }
                                            });
                                        } catch (e) {
                                            console.log(e)
                                            reject(e)
                                        }
                                    })

                                }
                            })
                        }
                    })

                } else {

                    let response = {
                        code: 200,
                        result: results
                    }
                    resolve(response);

                }
            }
            catch (e) {
                console.log(e)
                reject(e)
            }
        })
    },
    fetch_nested: async function (query1, query2, query3) {
        return new Promise((resolve, reject) => {
            try {
                pool.query(query1, (err, results, fields) => {
                    if (err) {
                        console.log(err)
                        let response = {
                            code: 500,
                            result: err
                        }
                        reject(response)
                    } else {

                        async.each(results, async function (element, callback) {

                            let value = await self.fetch(query2)

                            element['a'] = value.result;

                            let value2 = await self.fetch(query3)

                            element['b'] = value2.result.length > 0 ? value2.result[0] : {};


                            callback;

                        }, async function (err) {
                            if (err) {

                                console.log(err)

                                let response = {
                                    code: 500,
                                    result: err
                                }
                                reject(response)

                            } else {
                                let response = {
                                    code: 200,
                                    result: results
                                }
                                resolve(response);
                            }

                        });
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        })
    },
}