const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    minlength: 3,
    maxlength: 50
  },
  coverPhoto: {
    type: String
  },
  DateCreated: {
    type: Date,
    default: Date.now
  },
  Genre: [{ type: String, minlength: 1, maxlength: 5 }]
});
const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
