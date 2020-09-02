const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
router.use(authController.protect);
// router.use(authController.restrictTo('creator'));

router.route('/').post(publishController.createBook);
router
  .route('/:urlSlug/book/:bookId')
  .get(publishController.getBook)
  .post(publishController.createIssue)
  .patch(publishController.updateBook)
  .delete(publishController.deleteBook);
router
  .route('/:urlSlug/book/:bookId/issue/:issueNumber')
  .get(publishController.getIssue)
  .patch(publishController.updateIssue)
  .delete(publishController.deleteIssue);

module.exports = router;
