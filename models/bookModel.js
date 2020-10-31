const mongoose = require('mongoose');
// const User = require('./userModel');

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
  urlSlug: {
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
  imagePrefixReference: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'publisher'
  });
  next();
});

bookSchema.methods.adjustTotalIssue = function (adjustType) {
  if (adjustType === 'increment') {
    this.totalIssues += 1;
  } else if (adjustType === 'decrement') {
    this.totalIssues -= 1;
  }
};

const Books = mongoose.model('Book', bookSchema);

module.exports = Books;
