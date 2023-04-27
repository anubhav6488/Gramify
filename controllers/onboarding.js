try {
  const Operation = require("../operations/onboarding");
  const Response = require("../services/response");
  const Database = require("../services/database");
  var pool = require("../connections/mysql");
/////////////////////////for sending otp
  exports.send_otp = async (req, res, next) => {
    try {
      let { contact_number } = req.body;

      let response = await Operation.send_otp(contact_number);

      res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
///////////////////////////for verify otp
  exports.verify_otp_sql = async (req, res, next) => {
    try {
      let { session_id, otp } = req.body;

      let response = await Operation.verify_otp_sql(session_id, otp);

      res.status(response.code).send(response);
    } catch (e) {
      console.log(e);

      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
  exports.verify_otp = async (req, res, next) => {
    try {
      let { session_id, otp } = req.body;

      let response = await Operation.verify_otp(session_id, otp);

      res.status(response.code).send(response);
    } catch (e) {
      console.log(e);

      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
////////////////////////////////////fetching reseller
  exports.fetch = async (req, res, next) => {
    try {
      let response = await Operation.fetch();

      res.status(response.code).send(response);
    } catch (e) {
      console.log(e);

      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
/////////////////////fetch reseller by id
  exports.fetch_by_id = async (req, res, next) => {
    try {
      let { id } = req.decoded;

      console.log(id)

      let response = await Operation.fetch_by_id(id);

      res.status(response.code).send(response);
    } catch (e) {
      console.log(e);

      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
/////////////////////////////////////////updating for signup page for zoho
  exports.update = async (req, res, next) => {
    try {
      let {
        Name,
        is_sponcer,
        Full_Name,
        Email_ID,
        Designation,
        Experience,
        Social_URL,
        Referral_Code1,
        Company_Name,
        Website_URL,
        Why_Reseller,
        Company_Industry,
        Type,
        Company_size,
        referral_verified,
        
        
      } = req.body;


      let { id } = req.decoded;

      let response = await Operation.update(
        id,
        Name,
        Full_Name,
        Email_ID,
        Designation,
        Experience,
        Social_URL,
        Referral_Code1,
        Company_Name,
        Website_URL,
        Why_Reseller,
        Company_Industry,
        Type,
        Company_size,
        referral_verified,
        is_sponcer
      );

      res.status(response.code).send(response);
    } catch (e) {
      console.log(e);

      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
///////////////////////////////////////////////////////updating status , rejected at,name
  exports.update_status = async (req, res, next) => {
    try {
      let {
             Name,
        
        
      } = req.body;
      let { id } = req.decoded;
      // console.log(req.decoded)

      let response = await Operation.update_status(
        id,
      Name,
      );

      res.status(response.code).send(response);
    } catch (e) {
      console.log(e);

      res.status(500).send({
        code: 500,
        message: "Internal Server Error",
      });
    }
  };
  ////////////////////////////////////////////////////////////// verify_referral

  exports.verify_referral = async (req, res, next) => {
    try {
      let { referral } = req.body;

      let { mobile_number } = req.decoded;

      let response = await Operation.verify_referral(
        parseFloat(mobile_number),
        referral
      );

      res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(Response.internal_server_error.code)
        .send(Response.internal_server_error);
    }
  };
///////////////////////////////////for creating jws token
  exports.test_jwt_token = async (req, res, next) => {
    try {
      let { mobile_number } = req.params;

      console.log(req.params)

      let response = await Operation.create_jwt_token(mobile_number);

      res.status(response.code).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(Response.internal_server_error.code)
        .send(Response.internal_server_error);
    }
  };
} catch (e) {
  console.log(e);
}
