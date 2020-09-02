const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
// router.use(authController.protect);
// router.use(authController.restrictTo('creator'));

router.route('/').post(authController.protect, publishController.createBook);
router
  .route('/:urlSlug/book/:bookId')
  .get(publishController.getBook)
  .post(authController.protect, publishController.createIssue)
  .patch(authController.protect, publishController.updateBook)
  .delete(authController.protect, publishController.deleteBook);
router
  .route('/:urlSlug/book/:bookId/issue/:issueNumber')
  // .get(publishController.getIssue)
  .patch(authController.protect, publishController.updateIssue)
  .delete(authController.protect, publishController.deleteIssue);

module.exports = router;
