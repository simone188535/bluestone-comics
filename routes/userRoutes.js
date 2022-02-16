const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const AmazonSDKS3 = require('../utils/AmazonSDKS3');

const uploadS3 = AmazonSDKS3.uploadS3();

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

router.route('/update-profile-pic').patch(userController.updateProfileImg);
router
  .route('/update-background-profile-pic')
  .patch(userController.updateBackgroundProfileImg);

router
  .route('/profile-pic-image-prefix/:bookId?')
  .get(userController.getProfilePicImagePrefix);

module.exports = router;
