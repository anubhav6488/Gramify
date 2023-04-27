const { body } = require("express-validator");
const Operations = require("../operations/leadesapis");
const OperationsP = require("../operations/program");
const Response = require("../services/response");
/**CREATING LEADS
 * -----------------------------
 *  
 */
exports.create_leads = async (req, res, next) => {
  try {
    //   let { type } = req.params;
    let {
      Name,
      Lead_Type,
      Lead_Email_ID,
      Lead_Designation,
      Lead_Mobile_Number,
      Organization_Name,
      Program_Name,
      Lead_Status1,
      Cohort_List,
      Package,
      Reseller_ID,
      Reseller_name
    } = req.body;

    // let { id } = req.decoded;

    let response = await Operations.creating_leads(
      Name,
      Lead_Type,
      Lead_Email_ID,
      Lead_Designation,
      Lead_Mobile_Number,
      Organization_Name,
      Program_Name,
      Lead_Status1,
      Cohort_List,
      Package,
      Reseller_ID,
      Reseller_name
    );

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
/**FETCHING LEADS BY ID
 * -------------------------
 * 
 */
exports.fetch_leads_by_id = async (req, res, next) => {
  try {
    // let { id } = req.decoded;
    let { id } = req.body;
    console.log("_____________________", req.body);
    // console.log("____________________--",id)

    let response = await Operations.fetching_leads_by_id(id);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
/**FETCHING ALL LEADS
 * ---------------------------------------
 *  
 */
exports.fetch_all_leads = async (req, res, next) => {
  try {
    let { like = "" } = req.query;

    let response = await Operations.fetching_all_leads(like);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};
/**FETCHING OFEX LEADS BY FILTER
 * -------------------------------
 *  by Reseller_ID
 * by Name
 * by Lead_Type
 * by cohort
 */
exports.fetch_all_leads_filter = async (req, res, next) => {
  try {
    let data = req.body;

    let response = await Operations.fetch_all_leads_filter(data);

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};

/**FETCHING LEAD STATUS
 * -------------------------------
 * Fetching collection of lead status 
 * from firebase
 */
exports.fetch_lead_status = async (req, res, next) => {
  try {
    
    let response = await Operations.fetch_lead_status();

    res.status(response.code).send(response);
  } catch (error) {
    res
      .status(Response.internal_server_error.code)
      .send(Response.internal_server_error);
  }
};