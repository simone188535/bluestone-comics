const mongoose = require('mongoose');

const workCreditsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // book: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Book',
  //   required: true
  // },
  // issue: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Issue',
  //   required: true
  // },
  // issueNumber: {
  //   type: Number,
  //   default: 1,
  //   required: true
  // },
  credits: [
    {
      type: String,
      enum: [
        'Writer',
        'Artist',
        'Editor',
        'Inker',
        'Letterer',
        'Penciller',
        'Colorist',
        'Cover Artist'
      ],
      required: true
    }
  ]
});

module.exports = workCreditsSchema;
