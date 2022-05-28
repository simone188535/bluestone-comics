const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const bookmarkController = require('../controllers/bookmarkController');

router.route('/get-all').get(bookmarkController.getAllBookmarks);
router.use(authController.protect);

router.route('/').get(bookmarkController.getBookmark);
router.route('/create').get(bookmarkController.createBookmark);
router.route('/delete').get(bookmarkController.deleteBookmark);
module.exports = router;
