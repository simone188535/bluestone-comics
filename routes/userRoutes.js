const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// define the home page route
router.route('/').get(userController.getAllUsers);
//   .post(userController.createUser)

module.exports = router;
