const { body } = require("express-validator");
const Operations = require("../operations/firecmsapis");
const OperationsP = require("../operations/program");
const Response = require("../services/response");

exports.read = async (req, res, next) => {
  try {
    let { category } = req.body;

    let response = await Operations.fetch(category);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

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
exports.read_type_all = async (req, res, next) => {
  try {
    let { type } = req.params;

    let response = await Operations.fetch_all(type);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

////////////////////////////////////////////////fetch category by name

exports.read_category_by_name = async (req, res, next) => {
  try {
    let { name } = req.params;

    let response = await Operations.fetch_category_by_name(name);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
/**  fetching  all program with category
*---------------------------------------------
* (in program category is there)
 */
exports.read_all_category = async (req, res, next) => {
  try {
    let response = await Operations.fetch_all_category_with_program();

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
/////////////////////////////////////////////////
exports.read_category = async (req, res, next) => {
  try {
    let response = await Operations.fetch_category();

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

// /** fetching all faq
// *--------------------------------------
// */
// exports.read_all_faq = async (req, res, next) => {
//   try {
//     // let { type } = req.params;

//     let response = await Operations.fetch_read_all_faq();

//     res.status(response.code).send(response);
//   } catch (error) {
//     res
//       .status(Response.internal_server_error.code)
//       .send(Response.internal_server_error);
//   }
// };
////////////////////////////////////////////////////////////for category only
exports.read_Category_only = async (req, res, next) => {
  try {
    // let { category } = req.body;
    console.log("//////////////////////////////");

    let response = await Operations.fetch_read_Category_only();

    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
exports.read_program_by_id = async (req, res, next) => {
  try {
    let { program, category } = req.body;

    let response = await Operations.fetch_program_with_all_data(
      category,
      program
    );

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
///////////////////////////////read_all_program

exports.read_all_program = async (req, res, next) => {
  try {
    let { count = 10, like = "", page = 1 } = req.query;

    let response = await Operations.fetch_all_program(page, count, like);
    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

////////////////////////////////////////////////////////////
exports.read_all_program_based_filter = async (req, res, next) => {
  try {
    let { count = 10, like = "", page = 1} = req.query;
    let { catid = []} = req.body
    // console.log(req.query)
    let response = await Operations.fetch_all_program_based_filter(catid,page, count, like);
    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
//////////////////////////////////////test
exports.read_all_test = async (req, res, next) => {
  try {
    let { count = 10, like = "", page = 1 } = req.query;

    let response = await Operations.fetch_all_test(page, count, like);
    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

///////////////////////////////
exports.read_all_cohort_by_program = async (req, res, next) => {
  try {
    let { program, category, cohorts } = req.body;
    console.log(req.body);

    let response = await Operations.fetch_all_cohort_by_program(
      category,
      program
    );

    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

// exports.read_Instructors_by_id = async (req, res, next) => {
//   try {
//      let { program, category,cohorts,Instructors } = req.body;

//     let response = await Operations.fetch_Instructors_by_id(category, program,cohorts,Instructors);

//     res.status(response.code).send(response);
//   } catch (error) {
//     res
//       .status(Response.internal_server_error.code)
//       .send(Response.internal_server_error);
//   }
// };

// read_Instructors_by_id /Category/WmO3NVl2LBpnFg58DjO1/programs/pnqA386y2NVKAGzwc3UE/cohorts
// read_organization
exports.read_all_organization = async (req, res, next) => {
  try {
    let { organization } = req.body;
    console.log(req.body);

    let response = await Operations.fetch_all_organization(organization);

    res.status(response.code).send(response);
  } catch (error) {
    console.log(error);
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
/**FETCHING ALL FAQ
 * ---------------------------------
 *  
 */
exports.read_all_faq = async (req, res, next) => {
  try {
    // let { type } = req.params;

    let response = await Operations.fetch_read_all_faq();

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
exports.read_cohort = async (req, res, next) => {
  try {
    let { category_id, program_id, cohort_id } = req.body;

    let response = await Operations.fetch_cohort(
      category_id,
      program_id,
      cohort_id
    );

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
exports.read_program_by_KEYWORD = async (req, res, next) => {
  try {
    let { key = "" } = req.params;

    let response = await Operations.fetch_program_by_KEYWORD(key);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
// s

// read_sponsorship_by_number
// read_program_by_KEYWORD
