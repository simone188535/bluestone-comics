const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please Provide an Email!'],
    lowercase: true
  },
  roles: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
    required: [true, 'Please Provide an Password!'],
    minlength: 6
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password !== val;
      },
      message: 'Passwords do not match. Try again'
    },
    required: [true, 'Please Confirm Password!']
  },
  passwordResetToken: String,
  passwordResetTokenExpires: String,
  DateCreated: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
