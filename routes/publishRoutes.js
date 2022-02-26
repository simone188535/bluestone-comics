const express = require('express');

const router = express.Router();

const multer = require('multer');

const upload = multer();
// const upload = multer({ dest: 'uploads/' });
const AmazonSDKS3 = require('../utils/AmazonSDKS3');

const uploadS3 = AmazonSDKS3.uploadS3();

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

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
  .route('/:urlSlug/book/:bookId')
  // .get(publishController.getBookAndIssues)
  .get(publishController.getBook)
  // .get(publishController.getIssues)
  .post(
    uploadS3.fields([
      { name: 'issueCoverPhoto', maxCount: 1 },
      { name: 'issueAssets' }
    ]),
    publishController.createIssue
  )
  .patch(
    // upload.none() is for text-only multipart form data
    upload.none(),
    publishController.updateBook
  )
  .delete(publishController.deleteBook);

router.route('/:urlSlug/book/:bookId/issues').get(publishController.getIssues);

// File Update Routes
router
  .route('/:urlSlug/book/:bookId/book-cover-photo')
  .patch(
    upload.single('bookCoverPhoto'),
    publishController.updateBookCoverPhoto
  );
router
  .route('/:urlSlug/book/:bookId/issue/:issueNumber/issue-cover-photo')
  .patch(
    // add a middleware that checks the S3 book prefix
    uploadS3.single('issueCoverPhoto'),
    publishController.updateIssueCoverPhoto
  );
router.route('/:urlSlug/book/:bookId/issue/:issueNumber/issue-assets').patch(
  // add a middleware that checks the S3 book prefix
  uploadS3.fields([{ name: 'issueAssets' }]),
  publishController.updateIssueAssets
);

router
  .route('/:urlSlug/book/:bookId/issue/:issueNumber')
  .get(publishController.getIssue)
  .patch(upload.none(), publishController.updateIssue)
  .delete(publishController.deleteIssue);

router
  .route('/get-book-and-issue-image-prefix/:bookId?/:issueNumber?')
  .get(publishController.getBookAndIssueImagePrefix);

module.exports = router;
