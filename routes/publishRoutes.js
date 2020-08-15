const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

// define the home page route
router.route('/').post(authController.protect, publishController.createBook);

module.exports = router;
