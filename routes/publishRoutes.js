const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const publishController = require('../controllers/publishController');

router.route('/').post(authController.protect, publishController.createBook);
router
  .route('/:title-slug/book/:bookId')
  // .get(publishController.getBook)
  .patch(authController.protect, publishController.updateBook)
  .post(authController.protect, publishController.createIssue)
  .delete(authController.protect, publishController.deleteBook);
router
  .route('/:title-slug/book/:bookId/Issue/:issueNumber')
  // .get(publishController.getIssue)
  .put(authController.protect, publishController.updateIssue)
  .delete(authController.protect, publishController.deleteIssue);

module.exports = router;
