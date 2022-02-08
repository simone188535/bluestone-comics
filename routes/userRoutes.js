const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// define the home page route
router.route('/get-user').get(userController.getUser);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:resetToken').patch(authController.resetPassword);

router.use(authController.protect);
router.route('/').get(userController.getAllUsers);
router.route('/update-password').patch(authController.updatePassword);
router.route('/update-me').patch(userController.updateMe);
router.route('/delete-me').delete(userController.deleteMe);
router.route('/get-me').get(userController.getMe);

module.exports = router;
