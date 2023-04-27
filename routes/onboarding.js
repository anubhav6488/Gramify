const authenticator = require("../middleware/authenticator");
const controller = require("../controllers/onboarding");
const express = require("express");
const router = express.Router();
const sanitizer = require("../sanitizers/onboarding");
const validator = require("../validators/onboarding");
///////////////////////for sending otp
router.post(
  "/verification/mobile",
  validator.validate_send_OTP,
  sanitizer.sanitize_send_OTP,
  controller.send_otp
);
///////////////////////////////for verifying otp
router.post(
  "/verification/otp_sql",
  validator.verify_otp,
  sanitizer.verify_otp,
  controller.verify_otp_sql
);
router.post(
  "/verification/otp",
  validator.verify_otp,
  sanitizer.verify_otp,
  controller.verify_otp
);
////////////////////////////fetching reseller
router.get("/reseller", controller.fetch);

/////////////////////////////////fetch reseller by id
router.get("/", authenticator.authenticator, controller.fetch_by_id);

///////////////////////////updating for signup page for zoho
router.put(
  "/",
  authenticator.authenticator,
  validator.validate_update,
  sanitizer.update_san,
  controller.update
);

////////////////////////////updating status , rejected at,name
router.put("/status", authenticator.authenticator, controller.update_status);

////////////////////////////////////verifying referral 
router.post(
  "/verify/referral",
  authenticator.authenticator,
  validator.verify_referral,
  sanitizer.verify_referral,
  controller.verify_referral
);

/////////////////////////////////generating jws token

router.get("/test/token/:mobile_number", controller.test_jwt_token);

module.exports = router;
