const express = require('express');

const router = express.Router();

const readController = require('../controllers/readController');
// THESE NEED TO BE TESTED !!!!!!!!!!!
router.route('/').get(readController.getAllBooks);
router.route('/:url-slug/book/:bookId').get(readController.getBook);
router
  .route('/:url-slug/book/:bookId/Issue/:issueNumber')
  .get(readController.getIssue);

module.exports = router;
