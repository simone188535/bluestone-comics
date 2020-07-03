const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

const keys = require('../config/keys.js');

const signToken = (user) => {
  return jwt.sign({ id: user._id }, keys.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    photo,
    password,
    passwordConfirm
  } = req.body;
  const newUser = await User.create({
    firstName,
    lastName,
    username,
    email,
    photo,
    password,
    passwordConfirm
  });

  const token = signToken(User);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError(`Email or Password has not been provided!`, 400));
  }

  const existingUser = await User.findOne({ email }).select('+password');

  if (!existingUser) {
    next(new AppError(`User not found. Please Sign Up.`, 401));
  }

  const passedPasswordVerification = await existingUser.passwordCompare(
    password,
    existingUser.password
  );

  if (!passedPasswordVerification) {
    return next(new AppError('Password is incorrect', 406));
  }
  const token = signToken(existingUser);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, keys.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists.', 401)
    );
  }

  // 4) Check if password was updated after the token was issued.
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password was recently changed. Login again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email', 403));
  }
  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Password Reset: <a href="${resetURL}">${resetURL}</a>. If not, please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes).',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is a user, set the new password
  if (!user) {
    new AppError('Token is invalid or has expired.', 400);
  }
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT

  const token = signToken(user);
  res.status(200).json({
    status: 'success',
    token
  });
});
