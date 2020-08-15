// const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Book = require('../models/bookModel');

exports.createBook = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  console.log('Is this controller working?');
  res.status(200).json({
    status: 'success'
  });
});
