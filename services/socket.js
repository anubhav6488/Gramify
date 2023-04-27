const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];
const secret = stage.JWT_SECRET;
const pool = require('../connections/mysql');
const morgan = require('morgan');
var async = require('async')
const Database = require('./../services/database');


module.exports = function (io) {
    try {
        io.use(function (socket, next) {
            if (socket.handshake && socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(socket.handshake.query.token, secret, function (err, decoded) {
                    if (err) {
                        return next(new Error('Authentication error'))
                    }
                    socket.decoded = decoded;
                    next();
                });
            } else {
                next(new Error('Authentication error'));
            }
        })
            .on('connection', function (socket) {
                console.log('*Inside Socket*')
            });
    }
    catch (e) {
        console.log("Socket Error: ", e)
    }
};