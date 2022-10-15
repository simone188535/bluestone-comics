const express = require('express');

const router = express.Router();

const AmazonSDKS3 = require('../../utils/AmazonSDKS3');

const uploadS3 = AmazonSDKS3.uploadS3();

const authController = require('../../controllers/authController');
const publishController = require('../../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
router.use(authController.protect);
// router.use(authController.restrictTo('creator'));

router
  .route('/')
  .post(
    uploadS3.fields([
      { name: 'bookCoverPhoto', maxCount: 1 },
      { name: 'issueCoverPhoto', maxCount: 1 },
      { name: 'issueAssets' }
    ]),
    publishController.createBook
  );

router
  .route('/get-book-and-issue-image-prefix/:bookId?/:issueNumber?')
  .get(publishController.getBookAndIssueImagePrefix);

module.exports = router;
