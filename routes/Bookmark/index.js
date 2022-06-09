const express = require('express');

const router = express.Router();
const bookmarkRoutes = require('./bookmarkRoutes');
const bookmarkController = require('../../controllers/bookmarkController');
const authController = require('../../controllers/authController');

router.route('/get-all').get(bookmarkController.getAllBookmarks);

router.use(authController.protect);
router.use('/:bookId', bookmarkRoutes);

module.exports = router;
