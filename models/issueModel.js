const mongoose = require('mongoose');
const issueAssetsSchema = require('./issueAssetsModel');

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
    maxlength: 20,
    required: [true, 'Please Provide an Title!']
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
  issueAssets: [issueAssetsSchema]
});
const Issues = mongoose.model('Issues', issueSchema);

module.exports = Issues;
