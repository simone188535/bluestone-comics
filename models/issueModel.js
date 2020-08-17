const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookId: {
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
  IssueNumber: Number,
  totalPages: Number,
  DateCreated: {
    type: Date,
    default: Date.now
  }
});
const Issues = mongoose.model('Issues', issueSchema);

module.exports = Issues;
