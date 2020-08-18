const mongoose = require('mongoose');

const issueAssetsSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  photoURL: {
    type: String,
    default: 'default.jpg'
  },
  pageNumber: Number,
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = issueAssetsSchema;
