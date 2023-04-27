const authenticator = require("../middleware/authenticator");
const controller = require("../controllers/sponsorapis");
const express = require("express");
const router = express.Router();
// const sanitizer = require("../sanitizers/onboarding");
// const validator = require("../validators/onboarding");
router.get(
    "/get/sponsorship/:id",
    // authenticator.authenticator,
    controller.read_sponsorship_by_id
  );
  router.post(
    "/sponsorship/details",
    // authenticator.authenticator,
    controller.post_sponsorship
  );
  router.put(
    "/cohort/update",
    // authenticator.authenticator,
    controller.put_sponsorship
  );
  router.get(
    "/get/sponsorship/details",
    // authenticator.authenticator,
    controller.read_all_sponsorship
  );
  router.get(
    "/get/sponsorship/status/:status",
    authenticator.authenticator,
    controller.read_sponsorship_by_status
  );
  
  ////////////////for updating is_active(active/inactive)
  router.put(
    "/is_active/update",
    // authenticator.authenticator,
    controller.is_active
  );
  /////////////////////for updating status(deleted/not deleted)
  router.put(
    "/status/update",
    // authenticator.authenticator,
    controller.update_statuss
  );

module.exports = router;
