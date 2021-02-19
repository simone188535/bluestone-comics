const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const subscriberController = require('../controllers/subscriberController');

router.use(authController.protect);
router
  .route('/add')
  .get(
    subscriberController.checkSubscription(false),
    subscriberController.Subscribe
  );
router
  .route('/remove')
  .get(
    subscriberController.checkSubscription(false),
    subscriberController.Unsubscribe
  );
// router.route('/check-subscription').get(subscriberController.checkSubscription);
router
  .route('/check-subscription')
  .get(subscriberController.checkSubscription(true));

module.exports = router;
