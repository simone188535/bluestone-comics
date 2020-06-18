// const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: users
  });
});

// exports.createUser = catchAsync((req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: 'Working user route',
//   });
// });
