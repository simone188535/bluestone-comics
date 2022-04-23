const express = require('express');

const router = express.Router({ mergeParams: true });

const multer = require('multer');

const upload = multer();
// const upload = multer({ dest: 'uploads/' });
const AmazonSDKS3 = require('../../utils/AmazonSDKS3');

const uploadS3 = AmazonSDKS3.uploadS3();

const authController = require('../../controllers/authController');
const publishController = require('../../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
// router.use(authController.protect);
// router.use(authController.restrictTo('creator'));

router
  .route('/')
  // .get(publishController.getBookAndIssues)
  .get(publishController.getBook)
  // .get(publishController.getIssues)
  .post(
    authController.protect,
    uploadS3.fields([
      { name: 'issueCoverPhoto', maxCount: 1 },
      { name: 'issueAssets' }
    ]),
    publishController.createIssue
  )
  .patch(
    authController.protect,
    // upload.none() is for text-only multipart form data
    upload.none(),
    publishController.updateBook
  )
  .delete(authController.protect, publishController.deleteBook);

router.route('/issues').get(publishController.getIssues);

// File Update Routes
router
  .route('/book-cover-photo')
  .patch(
    authController.protect,
    upload.single('bookCoverPhoto'),
    publishController.updateBookCoverPhoto
  );
router
  .route('/issue/:issueNumber/issue-cover-photo')
  .patch(
    authController.protect,
    upload.single('issueCoverPhoto'),
    publishController.updateIssueCoverPhoto
  );
router.route('/issue/:issueNumber/issue-assets').patch(
  authController.protect,
  // add a middleware that checks the S3 book prefix
  uploadS3.fields([{ name: 'issueAssets' }]),
  publishController.updateIssueAssets
);

router
  .route('/issue/:issueNumber')
  .get(publishController.getIssue)
  .patch(authController.protect, upload.none(), publishController.updateIssue)
  .delete(authController.protect, publishController.deleteIssue);

module.exports = router;
