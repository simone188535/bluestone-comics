const crypto = require('crypto');
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
    unique: true,
    required: [true, 'Please Provide an Email!'],
    lowercase: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: 'This is not a valid email!'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'creator'],
    default: 'user'
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
    required: [true, 'Please Provide an Password!'],
    minlength: 6,
    select: false
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
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  passwordResetToken: String,
  passwordResetTokenExpires: String,
  active: {
    type: Boolean,
    default: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});
// Encrypts password before saving it
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
// Alters passwordChangedAt when password is updated
userSchema.pre('save', async function save(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function save(next) {
  this.where('active').ne(false);
  next();
});
// Checks if users password is correct
userSchema.methods.passwordCompare = async function (
  providedPassword,
  currentPassword
) {
  return await bcrypt.compare(providedPassword, currentPassword);
};

// Checks if the logged in user changed their password after jwt token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means Not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; // Expires in 30 minutes

  return resetToken;
};
const Users = mongoose.model('User', userSchema);

module.exports = Users;
