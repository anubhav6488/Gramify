const express = require("express");
const router = express.Router();

// Controlling autority for the route
const controller = require('../controllers/boiler_plate');

// Authenticate User
const authenticator = require('../middleware/authenticator');

// Check request parameter
const validator = require('../validators/boiler_plate');

// Sanitize request parameter
const sanitizer = require('../sanitizers/boiler_plate');

// To fetch all the data.
router.get(
    '/',
    authenticator.authenticate,
    controller.read_all
);

// To fetch single data.
router.get(
    '/:id',
    authenticator.authenticate,
    validator.validateFetch,
    sanitizer.sanitizeFetch,
    controller.read
);

// To create a new data.
router.post(
    '/',
    authenticator.authenticate,
    validator.validateCreate,
    sanitizer.sanitizeCreate,
    controller.create
);

// // To update an existing data.
router.put(
    '/:id',
    authenticator.authenticate,
    validator.validateUpdate,
    sanitizer.sanitizeUpdate,
    controller.update
);

// To delete an existing data.
router.delete(
    '/:id',
    authenticator.authenticate,
    validator.validateDelete,
    sanitizer.sanitizeDelete,
    controller.delete
)

module.exports = router;