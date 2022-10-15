const express = require('express');

const router = express.Router();
const publishBookIssuesRoutes = require('./publishBookIssuesRoutes');
const publishRoutes = require('./publishRoutes');

router.use('/', publishRoutes);
router.use('/:urlSlug/book/:bookId', publishBookIssuesRoutes);

module.exports = router;
