const express = require("express");
const router = express.Router();

// Cron Reports
const midnight_cron = require('../jobs/midnight_cron');

// Brands Route
const zohoapis = require('../routes/zohoapis')

const firecmsapis = require('../routes/firecmsapis')
const leadesapis = require('../routes/leadesapis')
const sponsorapis = require('../routes/sponsorapis')

const seller = require("../routes/onboarding");

// Users
router.use('/zohoapis', zohoapis)

// Firebase
router.use('/fire', firecmsapis)
//Firebase leades
router.use('/leads', leadesapis)
//Firebase sponsorapiss
router.use('/sponsor', sponsorapis)

router.use('/seller', seller)

// Scheduled Jobs
router.use('/cron', midnight_cron)

module.exports = router;
