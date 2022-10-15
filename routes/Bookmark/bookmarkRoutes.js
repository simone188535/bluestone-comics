const express = require('express');

const router = express.Router({ mergeParams: true });
const bookmarkController = require('../../controllers/bookmarkController');

router.route('/').get(bookmarkController.getBookmark);
router.route('/create').post(bookmarkController.createBookmark);
router.route('/delete').delete(bookmarkController.deleteBookmark);
module.exports = router;
