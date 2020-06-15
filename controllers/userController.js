// const express = require('express');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/userModel');

exports.getAllUsers = catchAsync((req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'get all users route'
  });
});

// exports.createUser = catchAsync((req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: 'Working user route',
//   });
// });

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
  const newUser = User.create({
    firstName,
    lastName,
    username,
    email,
    photo,
    password,
    passwordConfirm
  });
  // user.passwordConfirm = undefined;
  //   await user.save();
  //   console.log(user);

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync((req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'login route created'
  });
});
