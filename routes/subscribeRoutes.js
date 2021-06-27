const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const subscriberController = require('../controllers/subscriberController');

router
  .route('/get-all-subscribers')
  .get(subscriberController.getAllSubscribers);

router
  .route('/get-all-subscribed')
  .get(subscriberController.getAllSubscribedTo);

router.use(authController.protect);
router
  .route('/add')
  .post(
    subscriberController.checkSubscription(),
    subscriberController.subscribe
  );
router
  .route('/remove')
  .post(
    subscriberController.checkSubscription(),
    subscriberController.unsubscribe
  );
router
  .route('/check-subscription')
  .get(subscriberController.checkSubscription(true));

module.exports = router;
