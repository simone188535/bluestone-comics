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
  slug: {
    type: String,
    maxlength: 100,
    required: [true, 'Please Provide a Slug URL!']
  },
  coverPhoto: {
    type: String,
    default: 'default.jpg'
  },
  description: {
    type: String,
    maxLength: 100,
    required: [true, 'Please Provide an Description!']
  },
  totalIssues: {
    type: Number,
    default: 1
  },
  genres: {
    type: [String]
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Hiatus'],
    default: 'Ongoing'
  },
  removed: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
