// const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Book = require('../models/bookModel');

// This creates both the book Id and thr first Issue
exports.createBook = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  // console.log(req.user);
  const { title, coverPhoto, genres } = req.body;
  const newBook = await Book.create({
    publisher: req.user.id,
    title,
    coverPhoto,
    genres
  });
  // console.log('))))', newBook.id);
  // const populated = await User.findOne({ _id: req.user.id }).populate(
  //   'publisher'
  // );
  // console.log('!!!!!!!', populated);
  res.status(200).json({
    status: 'success',
    book: newBook
  });
});
