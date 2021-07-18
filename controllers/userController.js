// const express = require('express');
const validator = require('validator');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const QueryPG = require('../utils/QueryPGFeature');
// const pageOffset = require('../utils/offset');
const pool = require('../db');

exports.getUser = catchAsync(async (req, res, next) => {
  const { id, username, email } = req.query;

  let findVal;
  let preparedStatementVal;

  if (id) {
    findVal = 'id';
    preparedStatementVal = id;
  } else if (username) {
    findVal = 'username';
    preparedStatementVal = username;
  } else if (email) {
    findVal = 'email';
    preparedStatementVal = email;
  } else {
    return next(
      new AppError(
        'An id, username, or email must be provided to retrieve a user.',
        406
      )
    );
  }

  // const user = await User.findOne(queryObject);
  const user = await new QueryPG(
    pool
  ).find(
    'email, username, user_photo, background_user_photo, role, bio, date_created',
    `users WHERE ${findVal} = ($1)`,
    [preparedStatementVal]
  );

  if (!user) {
    return next(new AppError('This user does not exist.', 404));
  }

  res.status(200).json({
    status: 'success',
    user
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  const users = await new QueryPG(pool).find('*', 'users', null, true);

  res.status(200).json({
    status: 'success',
    data: users
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    passwordConfirm
  } = req.body;

  // 1) THIS ROUTE IS NOT FOR PASSWORD UPDATES. PLEASE USE /update-password
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password',
        400
      )
    );
  }

  // Check if email is valid before updating
  if (!validator.isEmail(email)) {
    return next(new AppError('This is not a valid email!', 406));
  }

  const updatedUser = await new QueryPG(pool).update(
    'users',
    `first_name = ($1), last_name = ($2), username = ($3), email = ($4)`,
    'id = ($5)',
    [firstName, lastName, username, email, res.locals.user.id]
  );

  // remove encrypted passwords from results
  updatedUser.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // User is never really deleted. Just deactivated as a safety precaution
  // await User.findByIdAndUpdate(
  //   res.locals.user.id,
  //   { $set: { active: false } },
  //   { new: true }
  // );

  // Change user account activity to false, this account is no longer active
  const currentUser = await new QueryPG(pool).find(
    '*',
    'users WHERE id = ($1)',
    [res.locals.user.id]
  );

  if (!currentUser) {
    return next(
      new AppError(
        'This user could not be found. Account cannot be deleted',
        404
      )
    );
  }

  if (currentUser.active === true) {
    await new QueryPG(pool).update(
      'users',
      'active = ($1), last_updated = ($2)',
      'id = ($3)',
      [false, new Date(), res.locals.user.id]
    );
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: res.locals.user
    }
  });
});
