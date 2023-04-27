const jwt = require("jsonwebtoken");
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const secret = stage.JWT_SECRET;
var pool = require("../connections/mysql");
const Database = require("../services/database");
const Response = require("../services/response");
const { body, param, validationResult } = require("express-validator");

module.exports = {
  validate_send_OTP: [
    body("contact_number")
      .exists({ checkFalsy: true, checkNull: true })
      .isLength({ min: 1, max: 5000 })
      .withMessage("Should not be empty")
      .trim(),
    function (req, res, next) {
      var error_validation = validationResult(req);
      if (!error_validation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.required("contact_number"));
      }
      next();
    },
  ],
  verify_otp: [
    body("session_id").exists({ checkFalsy: true, checkNull: true }),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("session_id").code)
          .send(Response.required("session_id"));
      }
      next();
    },
    body("otp").exists({ checkFalsy: true, checkNull: true }),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("otp").code)
          .send(Response.required("otp"));
      }
      next();
    },
  ],
  validate_update: [
    body("Name")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage("Should not be empty"),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.required("Name"));
      }
      next();
    },
    body("Full_Name")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage("Should not be empty"),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("a").code)
          .send(Response.required("Full_Name"));
      }
      next();
    },
    // body("Email_ID")
    //   .exists({ checkFalsy: true, checkNull: true })
    //   .withMessage("Should not be empty"),
    // function (req, res, next) {
    //   var errorValidation = validationResult(req);
    //   if (!errorValidation.isEmpty()) {
    //     return res
    //       .status(Response.required("a").code)
    //       .send(Response.false_value("Email_ID"));
    //   }
    //   next();
    // },
    // body("Designation")
    //   .exists({ checkFalsy: true, checkNull: true })
    //   .withMessage("Should not be empty"),
    // function (req, res, next) {
    //   var errorValidation = validationResult(req);
    //   if (!errorValidation.isEmpty()) {
    //     return res
    //       .status(Response.required("a").code)
    //       .send(Response.false_value("Designation"));
    //   }
    //   next();
    // },
    // body("Experience")
    //   .exists({ checkFalsy: true, checkNull: true })
    //   .withMessage("Should not be empty"),
    // function (req, res, next) {
    //   var errorValidation = validationResult(req);
    //   if (!errorValidation.isEmpty()) {
    //     return res
    //       .status(Response.required("a").code)
    //       .send(Response.false_value("Experience"));
    //   }
    //   next();
    // },
    // body("Social_URL")
    //   .exists({ checkFalsy: true, checkNull: true })
    //   .withMessage("Should not be empty"),
    // function (req, res, next) {
    //   var errorValidation = validationResult(req);
    //   if (!errorValidation.isEmpty()) {
    //     return res
    //       .status(Response.required("a").code)
    //       .send(Response.false_value("Social_URL"));
    //   }
    //   next();
    // },
    // body("Company_Name")
    //   .exists({ checkFalsy: true, checkNull: true })
    //   .withMessage("Should not be empty"),
    // function (req, res, next) {
    //   var errorValidation = validationResult(req);
    //   if (!errorValidation.isEmpty()) {
    //     return res
    //       .status(Response.required("a").code)
    //       .send(Response.false_value(" Company_Name"));
    //   }
    //   next();
    // },
  ],

  verify_referral: [
    body("referral").exists({ checkFalsy: true, checkNull: true }),
    function (req, res, next) {
      var errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        return res
          .status(Response.required("referral").code)
          .send(Response.required("referral"));
      }
      next();
    },
  ],
};
// Designation
