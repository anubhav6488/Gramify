const express = require("express");
const { validate } = require("node-cron");
const validator = require("../validators/fire");
const sanitizer = require("../sanitizers/fire");
const router = express.Router();

/////////////// Controlling autority for the route
const controller = require("../controllers/leadesapis");

/////////////////// Authenticate User
const authenticator = require("../middleware/authenticator");
router.post(
  "/create/leads",
  // authenticator.authenticate,
  // validator.validateFetch,
  // validator.validatecreate,
  controller.create_leads
);

router.get(
  "/fetch/leads",
  // authenticator.authenticate,
  // validator.validateFetch,
  // validator.validatecreate,
  controller.fetch_leads_by_id
);

router.get(
  "/fetch/all/leads",
  // authenticator.authenticate,
  // validator.validateFetch,
  // validator.validatecreate,
  controller.fetch_all_leads
);

router.post(
  "/fetch/leads_list",
  // authenticator.authenticate,
  // validator.validateFetch,
  // validator.validatecreate,
  controller.fetch_all_leads_filter
);

router.get(
  "/fetch/lead_status",
  // authenticator.authenticate,
  // validator.validateFetch,
  // validator.validatecreate,
  controller.fetch_lead_status
);

module.exports = router;

// router.get(
//   "/yoyo",
// //   sanitizer.firesan,
// //   validator.validatefire,
//   controller.read_sql
// );
