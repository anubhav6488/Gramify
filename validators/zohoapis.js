const jwt = require("jsonwebtoken");
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const secret = stage.JWT_SECRET;
var pool = require("../connections/mysql");
const Database = require("../services/database");
const Response = require("../services/response");
const { body, param, validationResult } = require("express-validator");
const { required } = require("../services/response");

module.exports = {
  validateFetch: [
    param("type")
      .exists({ checkFalsy: true, checkNull: true })
      .isLength({ min: 1, max: 5000 })
      .withMessage("Should not be empty"),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.required("type"));
      }
      next();
    },
  ],
  validatecreate: [
    param("type")
      .exists({ checkFalsy: true, checkNull: true })
      .isLength({ min: 1, max: 5000 })
      .withMessage("Should not be empty"),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.required("type"));
      }
      next();
    },
    body("mobile_number")
      .exists({ checkFalsy: true, checkNull: true })
      .isNumeric()
      .isLength({ min: 10, max: 11 })
      .withMessage("Should not be empty"),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.required("mobile_number"));
      }
      next();
    },
    body("mobile_number").isNumeric(),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.false_value("mobile_number"));
      }
      next();
    },
  ],
  // Mobile_Number:{
  //   required:true,
  //   unique:true

  // }

  // user can be created now!
};
