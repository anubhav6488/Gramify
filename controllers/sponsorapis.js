const { body } = require("express-validator");
const Operations = require("../operations/sponsorapis");
const OperationsP = require("../operations/program");
const Response = require("../services/response");

// exports.read_type = async (req, res, next) => {
//   try {
//     let { type } = req.params;

//     let response = await Operations.fetch(type);

//     res.status(response.code).send(response);
//   } catch (error) {
//     res
//       .status(Response.internal_server_error.code)
//       .send(Response.internal_server_error);
//   }
// };
////////////////////////////////fetch collection by params
exports.read_all_sponsorship = async (req, res, next) => {
  try {
    // let { type } = req.params;

    let response = await Operations.fetch_all_sponsorship();

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
exports.read_all_idpass = async (req, res, next) => {
  try {
    let { Name } = req.body;

    let response = await Operations.fetch_all_idpass(Name);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

exports.post_sponsorship = exports.create_sponsorship = async (

  req,
  res,
  next
) => {
  try {
    let {
      category_id,
      program_id,
      mobile_number,
      name,
      cohorts,
      status,
      is_active,
      created_at,
      Reseller_name
    } = req.body;
    console.log(req.body);

    // let { id } = req.decoded;
    // console.log("_____________________________________________",req.decoded)


    let response = await Operations.create_sponsorship(
      category_id,
      program_id,
      mobile_number,
      name,
      cohorts,
      status,
      is_active,
      created_at,
      // id,
      Reseller_name
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
exports.post_idpass = exports.create_idpass = async (
  req,
  res,
  next
) => {
  try {
    let {
      Name,
      Email_Address,
      password,
    } = req.body;
    console.log(req.body);

    // let { id } = req.decoded;
    // console.log("_____________________________________________",req.decoded)


    let response = await Operations.create_idpass(
      Name,
      Email_Address,
      password,
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
exports.put_sponsorship = exports.update_sponsorship = async (
  req,
  res,
  next
) => {
  try {
    let { sponsorship_id, cohorts } = req.body;
    console.log(req.body);

    // let { id } = req.decoded;

    let response = await Operations.update_sponsorship(sponsorship_id, cohorts);

    res.status(response.code).send(response);
  } catch (e) {
    console.log(e);

    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

exports.read_sponsorship_by_id = async (req, res, next) => {
  try {
    let { id } = req.params;

    // console.log(id)

    let response = await Operations.fetch_selected_sponsorship(id);

    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
exports.read_sponsorship_by_status = async (req, res, next) => {
  try {
    let { status } = req.params;
    let { mobile_number } = req.decoded;
    console.log(mobile_number);

    let response = await Operations.fetch_sponsorship_by_status(
      Email_Address,
      password
    );

    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
exports.is_active = exports.update_is_active = async (req, res, next) => {
  try {
    let { sponsorship_id, is_active } = req.body;
    console.log(req.body);

    // let { id } = req.decoded;

    let response = await Operations.update_is_active(sponsorship_id, is_active);

    res.status(response.code).send(response);
  } catch (e) {
    console.log(e);

    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};
// update_status
exports.update_statuss = exports.update_status = async (req, res, next) => {
  try {
    let { sponsorship_id, status } = req.body;
    // console.log(req.body)

    // let { id } = req.decoded;
    console.log("checking............................", req.body);

    let response = await Operations.update_status(sponsorship_id, status);

    console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", response);

    res.status(response.code).send(response);
  } catch (e) {
    console.log(e);

    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};
