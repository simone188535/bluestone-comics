const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// define the home page route
router.route('/').get(authController.protect, userController.getAllUsers);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router
  .route('/forgot-password')
  .post(authController.protect, authController.forgotPassword);
router
  .route('/reset-password/:token')
  .patch(authController.protect, authController.resetPassword);
router
  .route('/update-password')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
