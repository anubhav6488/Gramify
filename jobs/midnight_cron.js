const express = require("express");
const router = express.Router();

const cron = require("node-cron");

// Scheduled Reports
cron.schedule('0 30 12 * * *', () => {

});

module.exports = router;