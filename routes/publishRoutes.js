const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

// This middleware runs before all the routes beneath get the chance to. This checks if user is present for all routes before continuing.
router.use(authController.protect);

router.route('/').post(publishController.createBook);
router
  .route('/:title-slug/book/:bookId')
  .patch(publishController.updateBook)
  .post(publishController.createIssue)
  .delete(publishController.deleteBook);
router
  .route('/:title-slug/book/:bookId/Issue/:issueNumber')
  .put(publishController.updateIssue)
  .delete(publishController.deleteIssue);

module.exports = router;
