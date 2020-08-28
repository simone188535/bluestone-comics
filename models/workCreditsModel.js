const mongoose = require('mongoose');

const workCreditsSchema = new mongoose.Schema({
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
        'Colorist'
      ],
      required: true
    }
  ]
});

module.exports = workCreditsSchema;
