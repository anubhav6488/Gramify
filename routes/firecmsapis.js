const express = require("express");
const { validate } = require("node-cron");
const validator = require("../validators/fire");
const sanitizer = require("../sanitizers/fire");
const router = express.Router();

/////////////// Controlling autority for the route
const controller = require("../controllers/firecmsapis");

/////////////////// Authenticate User
const authenticator = require("../middleware/authenticator");

///////////// To fetch all the data.
router.get("/", controller.read);

////////////////////fetch collection by params
router.get("/all/test/:type", controller.read_type_all);

/////////////////////////////////fetch category by name
router.get(
  "/read_category_by_name/:name",
  sanitizer.firesan,
  validator.validatefire,
  controller.read_category_by_name
);
// router.get(
//   "/organization/industries",
//   // authenticator.authenticator,
//   controller.read_all_organization
// );
// router.post(
//   "/search/:key",
//   // authenticator.authenticator,
//   controller.read_program_by_KEYWORD
// );


router.get(
  "/program/all",
  // authenticator.authenticator,
  controller.read_all_category
);
router.get(
  "/faq/all",
  // authenticator.authenticator,
  controller.read_all_faq
);
router.get(
  "/Category_list",
  // authenticator.authenticator,
  controller.read_Category_only
);

router.post(
  "/category/program/cohort",
  // authenticator.authenticator,
  controller.read_cohort
);

router.post(
  "/category/program/cohort/all",
  // authenticator.authenticator,
  controller.read_all_cohort_by_program
);

router.post(
  "/category/program/all",
  // authenticator.authenticator,
  controller.read_program_by_id
);
router.post(
  "/program/all",
  // authenticator.authenticator,
  controller.read_all_program
);
router.post(
  "/program/filter",
  // authenticator.authenticator,
  controller.read_all_program_based_filter
);
router.post(
  "/test/all",
  // authenticator.authenticator,
  controller.read_all_test
);
router.get(
  "/organization/industries",
  // authenticator.authenticator,
  controller.read_all_organization
);
router.post(
  "/search/:key",
  // authenticator.authenticator,
  controller.read_program_by_KEYWORD
);
// is_active
module.exports = router;
/** */