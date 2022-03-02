const express = require('express');
const multer = require('multer');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const upload = multer();

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

router
  .route('/update-profile-photo')
  .patch(upload.single('profilePhoto'), userController.updateProfileImg);
router
  .route('/update-background-profile-photo')
  .patch(
    upload.single('backgroundProfilePhoto'),
    userController.updateBackgroundProfileImg
  );

router
  .route('/profile-pic-image-prefix')
  .get(userController.getProfilePicImagePrefix);

module.exports = router;
