const express = require('express');

const router = express.Router({ mergeParams: true });

const multer = require('multer');

const upload = multer();

const AmazonSDKS3 = require('../../utils/AmazonSDKS3');

const uploadS3 = AmazonSDKS3.uploadS3();

const authController = require('../../controllers/authController');
const publishController = require('../../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
router.use(authController.protect);
// router.use(authController.restrictTo('creator'));

router
  .route('/')
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

router.route('/issues').get(publishController.getIssues);

// File Update Routes
router
  .route('/book-cover-photo')
  .patch(
    upload.single('bookCoverPhoto'),
    publishController.updateBookCoverPhoto
  );
router
  .route('/issue/:issueNumber/issue-cover-photo')
  .patch(
    upload.single('issueCoverPhoto'),
    publishController.updateIssueCoverPhoto
  );
router
  .route('/issue/:issueNumber/issue-assets')
  .patch(uploadS3.array('issueAssets'), publishController.updateIssueAssets);

router
  .route('/issue/:issueNumber/prev-issue-work-credits')
  .get(publishController.prevExistingIssueWorkCredits);

router
  .route('/issue/:issueNumber')
  .get(publishController.getIssue)
  .patch(upload.none(), publishController.updateIssue)
  .delete(publishController.deleteIssue);

module.exports = router;
