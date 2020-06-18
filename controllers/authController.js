const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

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
