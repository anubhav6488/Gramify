const express = require("express");
const router = express.Router();

// Cron Reports
const midnight_cron = require('../jobs/midnight_cron');

// Brands Route

const firecmsapis = require('../routes/firecmsapis')
const sponsorapis = require('../routes/sponsorapis')

const seller = require("../routes/onboarding");


// Firebase
router.use('/fire', firecmsapis)
//Firebase sponsorapiss
router.use('/sponsor', sponsorapis)

router.use('/seller', seller)

// Scheduled Jobs
router.use('/cron', midnight_cron)

module.exports = router;
