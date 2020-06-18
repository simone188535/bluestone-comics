const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// define the home page route
router.route('/').get(authController.protect, userController.getAllUsers);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
//   .post(userController.createUser)

module.exports = router;
