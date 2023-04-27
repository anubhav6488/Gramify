const { body } = require("express-validator");
const Operations = require("../operations/fire");
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

exports.otp_insert = exports.otp_insert = async (req, res, next) => {
  try {
    let {
      sponsorship_id,cohorts
      
    } = req.body;
    console.log(req.body)


    // let { id } = req.decoded;

    let response = await Operations.otp_insert(
      sponsorship_id,cohorts
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
// s

// read_sponsorship_by_number
// read_program_by_KEYWORD
