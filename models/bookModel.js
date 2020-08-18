const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: [true, 'Please Provide an Title!']
  },
  coverPhoto: {
    type: String,
    default: 'default.jpg'
  },
  description: {
    type: String,
    maxLength: 150,
    required: [true, 'Please Provide an Description!']
  },
  totalIssues: {
    type: Number,
    default: 1
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  genres: {
    type: [String]
  }
});
const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
