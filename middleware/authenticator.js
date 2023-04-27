const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];
const secret = stage.JWT_SECRET;

module.exports = {
    authenticate: async (req, res, next) => {
        next();
        // const authorizationHeaader = req.headers.authorization;
        // let result;
        // if (authorizationHeaader) {
        //     const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        //     const options = {
        //     };
        //     try {
        //         result = jwt.verify(token, secret, options);
        //         req.decoded = result
        //         next()
        //     } catch (err) {
        //         result = {
        //             error: `False Token.`,
        //             status: 401
        //         };
        //         res.status(401).send(result);
        //     }
        // } else {
        //     result = {
        //         error: `Authentication error. Token required.`,
        //         status: 401
        //     };
        //     res.status(401).send(result);
        // }
    },
    authenticator: async (req, res, next) => {
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
            };
            try {
                result = jwt.verify(token, secret, options);
                req.decoded = result
                next()
            } catch (err) {
                result = {
                    error: `False Token.`,
                    status: 401
                };
                res.status(401).send(result);
            }
        } else {
            result = {
                error: `Authentication error. Token required.`,
                status: 401
            };
            res.status(401).send(result);
        }
    },
};
