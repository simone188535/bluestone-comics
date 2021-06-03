const express = require('express');

const router = express.Router();

const multer = require('multer');

const upload = multer();
// const upload = multer({ dest: 'uploads/' });
const AmazonSDKS3 = require('../utils/AmazonSDKS3');

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
router.use(authController.protect);
// router.use(authController.restrictTo('creator'));

router
  .route('/')
  .post(
    AmazonSDKS3.uploadS3().fields([
      { name: 'bookCoverPhoto', maxCount: 1 },
      { name: 'issueCoverPhoto', maxCount: 1 },
      { name: 'issueAssets' }
    ]),
    publishController.createBook
  );

router
  .route('/:urlSlug/book/:bookId')
  .get(publishController.getBookAndIssues)
  .post(publishController.createIssue)
  .patch(
    // upload.none() is for text-only multipart form data
    upload.none(),
    publishController.updateBook
  )
  .delete(publishController.deleteBook);

router.route('/:urlSlug/book/:bookId/book-cover-photo').patch(
  // add a middleware that checks the S3 book prefix
  AmazonSDKS3.uploadS3().single('bookCoverPhoto'),
  publishController.updateBookCoverPhoto
);
// router.route('/:urlSlug/book/:bookId/issue-cover-photo').patch(
//   // add a middleware that checks the S3 book prefix
//   AmazonSDKS3.uploadS3().single('bookCoverPhoto'),
//   publishController.updateBookCoverPhoto
// );
// router.route('/:urlSlug/book/:bookId/issue-assets').patch(
//   // add a middleware that checks the S3 book prefix
//   AmazonSDKS3.uploadS3().fields([{ name: 'issueAssets' }]),
//   publishController.updateBookCoverPhoto
// );

router
  .route('/:urlSlug/book/:bookId/issue/:issueNumber')
  // .get(publishController.getIssue)
  .patch(publishController.updateIssue)
  .delete(publishController.deleteIssue);

module.exports = router;
