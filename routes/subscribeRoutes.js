const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const subscriberController = require('../controllers/subscriberController');

router
  .route('/get-all-subscribers/publisher/:publisherId')
  .get(subscriberController.getAllSubscribers);

router
  .route('/get-all-subscribed-to/subscriber/:subscriberId')
  .get(subscriberController.getAllSubscribedTo);

router
  .route('/total-subscribers/publisher/:publisherId')
  .get(subscriberController.totalSubscribers);

router
  .route('/total-subscribed-to/subscriber/:subscriberId')
  .get(subscriberController.totalSubscribedTo);

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/add/publisher/:publisherId')
  .post(
    subscriberController.checkSubscription(),
    subscriberController.subscribe
  );
router
  .route('/remove/publisher/:publisherId')
  .delete(
    subscriberController.checkSubscription(),
    subscriberController.unsubscribe
  );
router
  .route('/check-subscription/publisher/:publisherId')
  .get(subscriberController.checkSubscription(true));

module.exports = router;
