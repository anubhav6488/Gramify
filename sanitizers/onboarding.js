const jwt = require("jsonwebtoken");
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const secret = stage.JWT_SECRET;
var pool = require("../connections/mysql");
const Database = require("../services/database");
const Response = require("../services/response");
const { body, param, validationResult } = require("express-validator");

module.exports = {
  sanitize_send_OTP: [
    body("contact_number")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
  ],

  verify_otp: [body("session_id").trim(), body("otp").toInt()],

  update_san: [
    body("Name")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Full_Name")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Email_ID")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Designation")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Experience")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Social_URL")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Referral_Code1")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Company_Name")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Website_URL")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
    body("Why_Reseller")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
  ],

  verify_referral: [
    body("referral")
      .trim()
      .customSanitizer((value) => {
        return value.replace(/'/g, "''");
      }),
  ],
};
