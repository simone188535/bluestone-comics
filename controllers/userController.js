// const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

// This filters the values of the req.body object and only allows the allowed fields to be altered
const filterObj = (object, ...allowedFields) => {
  const filteredObject = Object.keys(object)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return filteredObject;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: users
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) THIS ROUTE IS NOT FOR PASSWORD UPDATES. PLEASE USE /update-password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password',
        400
      )
    );
  }
  //2) Filtered out unwanted fields
  const filterBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'username'
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // User is never really deleted. Just deactivated as a safety precaution
  await User.findByIdAndUpdate(
    req.user.id,
    { $set: { active: false } },
    { new: true }
  );
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});
