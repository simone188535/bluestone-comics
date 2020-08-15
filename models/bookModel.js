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
  DateCreated: {
    type: Date,
    default: Date.now
  },
  Genres: [
    {
      type: String,
      minlength: 1,
      maxlength: 5,
      required: [true, 'Please Provide an Genre!']
    }
  ]
});
const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
