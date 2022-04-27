const express = require('express');

const router = express.Router({ mergeParams: true });
const readController = require('../../controllers/readController');

router.route('/').get(readController.getBook);
router.route('/genres').get(readController.getGenres);
router.route('/work-credits').get(readController.getBookWorkCredits);
router.route('/Issue/:issueNumber').get(readController.getIssue);
router
  .route('/Issue/:issueNumber/work-credits')
  .get(readController.getIssueWorkCredits);

module.exports = router;
