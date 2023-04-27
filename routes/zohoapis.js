const express = require("express");
const router = express.Router();

// Controlling autority for the route
const controller = require("../controllers/zohoapis");

// Authenticate User
const authenticator = require("../middleware/authenticator");

// Check request parameter
const validator = require("../validators/zohoapis");

// Sanitize request parameter
const sanitizer = require("../sanitizers/zohoapis");

// To fetch all the data.
router.get(
  "/:type",
  authenticator.authenticate,
  validator.validateFetch,
  controller.read
);

router.post(
  "/:type",
  authenticator.authenticate,
  validator.validateFetch,
  validator.validatecreate,
  controller.post
);
// router.put(
//   "/:type",
//   authenticator.authenticate,
//   validator.validateFetch,
//   controller.up
// );

module.exports = router;
