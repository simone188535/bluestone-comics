const express = require('express');

const router = express.Router();

const searchController = require('../controllers/searchController');

router.route('/').get(searchController.search);
router.route('/books').get(searchController.searchBooks);
router.route('/users').get(searchController.searchUsers);
router.route('/issues').get(searchController.searchIssues);

module.exports = router;
