const express = require('express');

const router = express.Router();

const subscriberController = require('../controllers/subscriberController');

router.route('/').get(subscriberController.Subscribe);

module.exports = router;
