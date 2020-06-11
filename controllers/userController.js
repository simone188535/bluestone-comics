const express = require('express');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync((req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'get all users route',
  });
});

// exports.createUser = catchAsync((req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: 'Working user route',
//   });
// });

exports.signup = catchAsync((req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'Sign up route created',
  });
});

exports.login = catchAsync((req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'login route created',
  });
});
