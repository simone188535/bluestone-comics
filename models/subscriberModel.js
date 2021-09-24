const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  // followee
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // follower
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Subscribers = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscribers;
