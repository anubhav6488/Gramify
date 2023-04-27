const axios = require('axios');




try {
  const Operations = require("../operations/zohoapis");
  const Response = require("../services/response");

  exports.read = async (req, res, next) => {
    try {
      let { type } = req.params;

      let response = await Operations.fetch(type);

      res.status(response.code).send(response);
    } catch (error) {
      res
        .status(Response.internal_server_error.code)
        .send(Response.internal_server_error);
    }
  };
  exports.post = async (req, res, next) => {
    try {
      let { type } = req.params;
      let { mobile_number } = req.body;

      let response = await Operations.post(type, mobile_number);

      res.status(response.code).send(response);
    } catch (error) {
      res
        .status(Response.internal_server_error.code)
        .send(Response.internal_server_error);

    }

  };
  exports.put = async (req, res, next) => {
    try {
      let { type } = req.params;
      let { full_name, mobile_number } = req.body;

      let response = await Operations.put(type, full_name, mobile_number);

      res.status(response.code).send(response);
    } catch (error) {
      res
        .status(Response.internal_server_error.code)
        .send(Response.internal_server_error);

    }

  };

} catch (e) {
  console.log(e);

}
