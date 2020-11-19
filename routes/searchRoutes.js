const express = require('express');

const router = express.Router();

const searchController = require('../controllers/searchController');

router.route('/').get(searchController.search);
router.route('/find-user').get(searchController.searchUsers);

module.exports = router;
