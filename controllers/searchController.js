// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const User = require('../models/userModel');
// const Book = require('../models/bookModel');
// const Issue = require('../models/issueModel');

exports.search = catchAsync(async (req, res, next) => {
  console.log('search route running');
  res.status(200).json({
    status: 'success'
  });
});