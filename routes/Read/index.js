const express = require('express');

const router = express.Router();
const readController = require('../../controllers/readController');
const readRoutes = require('./readRoutes');

router.route('/').get(readController.getAllBooks);
router.use('/:urlSlug/book/:bookId', readRoutes);

module.exports = router;
