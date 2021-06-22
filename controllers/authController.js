const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const pool = require('../db');
const QueryPG = require('../utils/QueryPGFeature');

const keys = require('../config/keys.js');

/* 
  This method creates a jwt Token for auth purposes in the front end to help identify
  a user. This token is named JWTToken and is stored in local storage in the browser
*/
const signToken = (user) => {
  return jwt.sign({ id: user.id }, keys.JWT_SECRET, {
    // expires in 7 days
    expiresIn: '7d'
  });
};

/* 
  This method send the jwt token to the client/browser
*/
const createSendToken = (user, status, res) => {
  if (!user.id) {
    throw new AppError('id field is missing, token is invalid', 500);
  }

  // this sends the new jwt token and updated user to the frontend
  const token = signToken(user);

  // hides password in json response
  user.password = undefined;

  res.status(status).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/* 
  This method encrypts a give users password and returns the encryption
*/
const bcryptPasswordEncryption = (password) => {
  return bcrypt.hash(password, 12);
};

/* 
  This method compares a user encrypted currentPassword(from the DB) to
  the providedPassword(provided by the user which is not yet encrypted)
  and returns true if they match. 
*/
const bcryptPasswordCompare = (providedPassword, currentPassword) => {
  return bcrypt.compare(providedPassword, currentPassword);
};

/* 
  Checks if the logged in user changed their password after jwt token was issued.
*/
const wasPasswordChangedAfterJWTIssued = (JWTTimestamp, passwordChangedAt) => {
  const JWTTimestampConverted = new Date(JWTTimestamp).toISOString();
  return JWTTimestampConverted < passwordChangedAt;
};

// BUG account reactivation, if account email is currently in the DB and is disabled, throw an error and tell user to go to login page
exports.signup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConfirm
  } = req.body;

  if (!validator.isEmail(email)) {
    return next(new AppError('This is not a valid email!', 406));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match. Try again!', 406));
  }

  const encryptedPassword = await bcryptPasswordEncryption(password);

  const insertTable = 'users(first_name, last_name, username, email, password)';
  const preparedStatement = '$1, $2, $3, $4, $5';

  const values = [firstName, lastName, username, email, encryptedPassword];

  const newUser = await new QueryPG(pool).insert(
    insertTable,
    preparedStatement,
    values
  );

  createSendToken(newUser, 200, res);
});

// BUG account reactivation, send message to client if account is reactivated, change account status to enabled if it is disabled
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`Email or Password has not been provided!`, 400));
  }

  const existingUser = await new QueryPG(pool).find(
    '*',
    'users WHERE email = $1',
    [email]
  );

  if (!existingUser) {
    return next(new AppError(`User not found. Please Sign Up.`, 401));
  }

  const passedPasswordVerification = await bcryptPasswordCompare(
    password,
    existingUser.password
  );

  if (!passedPasswordVerification) {
    return next(new AppError('Password is incorrect.', 406));
  }

  createSendToken(existingUser, 200, res);
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
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, keys.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await new QueryPG(pool).find('*', 'users WHERE id = $1', [
    decoded.id
  ]);

  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists.', 401)
    );
  }

  // 4) Check if password was updated after the token was issued.
  if (
    wasPasswordChangedAfterJWTIssued(decoded.iat, freshUser.password_changed_at)
  ) {
    return next(
      new AppError('Password was recently changed. Login again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  res.locals.user = freshUser;
  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(res.locals.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const { email } = req.body;
  // const user = await User.findOne({ email: req.body.email });
  const user = await new QueryPG(pool).find('*', 'users WHERE email = $1', [
    email
  ]);

  // console.log('user', user, user.email);

  if (!user) {
    return next(new AppError('There is no user with that email.', 403));
  }
  // 2) Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypt reset token and save it to the password_reset_token field on the user table
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // create an expiration date/time for token to the password_reset_token_expires field on the user table
  const passwordResetTokenExpires = new Date(
    Date.now() + 30 * 60 * 1000
  ).toISOString(); // Expires in 30 minutes

  await new QueryPG(pool).update(
    'users',
    `password_reset_token = ($1), password_reset_token_expires = ($2), last_updated = ($3)`,
    'email = ($4)',
    [passwordResetToken, passwordResetTokenExpires, new Date(), email]
  );

  // 3) Send it to user's email
  const host =
    process.env.NODE_ENV === 'production'
      ? req.get('host')
      : keys.FRONTEND_PORT;

  // const resetURL = `${req.protocol}://${host}/api/v1/users/reset-password/${resetToken}`;
  const resetURL = `${req.protocol}://${host}/reset-password/${resetToken}`;

  const message = `Forgot your password? Password Reset: <a href="${resetURL}">${resetURL}</a>. If not, please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 30 minutes).',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    // unset password_reset_token and password_reset_token_expires if there is an issue sending the email
    await new QueryPG(pool).update(
      'users',
      `password_reset_token = ($1), password_reset_token_expires = ($2), last_updated = ($3)`,
      'email = ($4)',
      [undefined, undefined, new Date(), user.email]
    );

    return next(
      new AppError('There was an error sending the email. Try again', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // find user that contains hashedToken and password reset token is not expired (time of token is greater than current time)
  const user = await new QueryPG(pool).find(
    '*',
    'users WHERE password_reset_token = ($1) AND password_reset_token_expires > ($2)',
    [hashedToken, new Date()]
  );

  // 2) If token has not expired, and there is a user, set the new password
  if (!user) {
    new AppError('Token is invalid or has expired.', 400);
  }

  const { password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match. Try again!', 406));
  }

  const encryptedPassword = await bcryptPasswordEncryption(password);

  const updatedUser = await new QueryPG(pool).update(
    'users',
    `password = ($1), password_reset_token = ($2), password_reset_token_expires = ($3), last_updated = ($4)`,
    'email = ($5)',
    [encryptedPassword, undefined, undefined, new Date(), user.email]
  );

  // 4) Log the user in, send JWT
  createSendToken(updatedUser, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  const currentDateTimestamp = new Date();

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match. Try again!', 406));
  }

  // 1) Get user from DB
  // const user = await User.findById(res.locals.user.id).select('+password');
  const user = await new QueryPG(pool).find('*', 'users WHERE id = ($1)', [
    res.locals.user.id
  ]);
  if (!user) {
    return next(new AppError('User cannot be found. Login or Sign up', 401));
  }

  // 2) Check if POSTed current password is correct
  // const passedPasswordVerification = await user.passwordCompare(
  //   currentPassword,
  //   user.password
  // );
  const passedPasswordVerification = await bcryptPasswordCompare(
    currentPassword,
    user.password
  );

  if (!passedPasswordVerification) {
    return next(new AppError('Password is incorrect.', 406));
  }

  const encryptedPassword = await bcryptPasswordEncryption(password);

  // 3) If so, update password
  const updatedUser = await new QueryPG(pool).update(
    'users',
    'password = ($1), password_changed_at = ($2), last_updated = ($3)',
    'id = ($4)',
    [
      encryptedPassword,
      currentDateTimestamp,
      currentDateTimestamp,
      res.locals.user.id
    ]
  );

  // user.password = password;
  // user.passwordConfirm = passwordConfirm;
  // await user.save();

  // 4) Log user in send jwt
  createSendToken(updatedUser, 200, res);
  // } catch (err) {
  //   return next(new AppError(err.message, 500));
  // }
});
