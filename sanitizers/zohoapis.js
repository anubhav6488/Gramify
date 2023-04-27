const jwt = require("jsonwebtoken");
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const secret = stage.JWT_SECRET;
var pool = require("../connections/mysql");
const Database = require("../services/database");
const Response = require("../services/response");
const { body, param, validationResult } = require("express-validator");

module.exports = {};
