const mongoose = require('mongoose');

const workCreditSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  issueNumber: {
    type: Number,
    default: 1,
    required: true
  },
  workCredits: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

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
    }
  ]
});

const workCredits = mongoose.model('workCredit', workCreditSchema);

module.exports = workCredits;
