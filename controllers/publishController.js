// const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Issue = require('../models/issueModel');

// This creates both the book Id and thr first Issue
exports.createBook = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  // console.log(req.user);
  const {
    bookTitle,
    bookCoverPhoto,
    bookDescription,
    genres,
    issueTitle,
    issueCoverPhoto,
    issueAssets
  } = req.body;

  const newBook = await Book.create({
    publisher: req.user.id,
    title: bookTitle,
    coverPhoto: bookCoverPhoto,
    description: bookDescription,
    genres
  });

  const newIssue = await Issue.create({
    publisher: req.user.id,
    book: newBook.id,
    title: issueTitle,
    coverPhoto: issueCoverPhoto,
    issueAssets
  });
  // const populated = await User.findOne({ _id: req.user.id }).populate(
  //   'publisher'
  // );
  // console.log('!!!!!!!', populated);
  // const populated = await User.findOne({ _id: req.user.id }).populate(
  //   'publisher'
  // );
  // console.log('!!!!!!!', populated);
  res.status(200).json({
    status: 'success',
    book: newBook,
    issue: newIssue
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success'
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success'
  });
});

exports.createIssue = catchAsync(async (req, res, next) => {
  // This will need to increment totalIssues in books Model
  res.status(200).json({
    status: 'success'
  });
});
exports.deleteIssue = catchAsync(async (req, res, next) => {
  // Only allow the deletion of the most recent issue
  res.status(200).json({
    status: 'success'
  });
});

exports.updateIssue = catchAsync(async (req, res, next) => {
  // edit any issue of a book
  res.status(200).json({
    status: 'success'
  });
});
