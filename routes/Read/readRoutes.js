const express = require('express');

const router = express.Router({ mergeParams: true });
const readController = require('../../controllers/readController');

router.route('/').get(readController.getBook);
router.route('/Issue/:issueNumber').get(readController.getIssue);

// Add get genres for books and issues: https://stackoverflow.com/questions/6059246/how-to-include-route-handlers-in-multiple-files-in-express/37309212#37309212

module.exports = router;
