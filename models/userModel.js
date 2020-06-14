const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please tell us your first name!']
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your last name!']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please tell us your username!']
  },
  email: {
    type: String,
    required: [true, 'Please Provide an Email!'],
    lowercase: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: 'This is not a valid email!'
    }
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
        if (this.password !== val) {
          return false;
        }
      },
      message: 'Passwords do not match. Try again!'
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

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    // this stops passwordConfirm from being saved to the db.
    this.passwordConfirm = undefined;
    return next();
  } catch (err) {
    return next(err);
  }
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
