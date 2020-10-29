const mongoose = require('mongoose');
// const issueAssetsSchema = require('./issueAssetsModel');
// const workCreditsSchema = require('./workCreditsModel');

const issueSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  title: {
    type: String,
    maxlength: 100
  },
  coverPhoto: {
    type: String,
    default: 'default.jpg'
  },
  issueNumber: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  // issueAssets: [issueAssetsSchema],
  issueAssets: {
    type: [String],
    // This is required and must have at least one
    validate: (v) => Array.isArray(v) && v.length > 0
  },
  // workCredits: [workCreditsSchema]
});

issueSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'publisher'
  });
  this.populate({
    path: 'book'
  });
  next();
});

const Issues = mongoose.model('Issue', issueSchema);

module.exports = Issues;
