// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const User = require('../models/userModel');
// const Book = require('../models/bookModel');
// const Issue = require('../models/issueModel');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  // edit any issue of a book
  res.status(200).json({
    status: 'success'
  });
});
exports.getBook = catchAsync(async (req, res, next) => {
  // Find book and all issues
  res.status(200).json({
    status: 'success'
  });
});

exports.getIssue = catchAsync(async (req, res, next) => {
  // Find issue of a book
  res.status(200).json({
    status: 'success'
  });
});
