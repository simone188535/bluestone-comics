// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Issue = require('../models/issueModel');
const pool = require('../db');
const QueryPG = require('../utils/QueryPGFeature');
const SearchFeatures = require('../utils/SearchFeatures');
const SearchQueryStringFeatures = require('../utils/SearchQueryStringFeatures');

exports.searchBooks = catchAsync(async (req, res, next) => {
  const parameterizedQuery = `books INNER JOIN users ON (users.id = books.publisher_id)`;
  const parameterizedQueryString = new SearchQueryStringFeatures(
    parameterizedQuery,
    req.query,
    []
  )
    .filter()
    .sort('books.')
    .paginate(20);

  const doc = await new QueryPG(pool).find(
    '*',
    parameterizedQueryString.query,
    parameterizedQueryString.parameterizedValues,
    true
  );

  // hide users password
  doc.forEach((bookData) => {
    bookData.password = undefined;
  });

  // Send Response
  res.status(200).json({
    results: doc.length,
    books: doc,
    status: 'success'
  });
});
exports.searchIssues = catchAsync(async (req, res) => {
  const searchResults = new SearchFeatures(Issue.find(), req.query, true)
    .filter()
    .sort('lastUpdate')
    .limitFields()
    .paginate();

  // Execute Query
  const doc = await searchResults.query;
  // const books = await query;
  // await search.populate('publisher');

  // Send Response
  res.status(200).json({
    results: doc.length,
    issues: doc,
    status: 'success'
  });
});

exports.search = catchAsync(async (req, res) => {
});

exports.searchUsers = catchAsync(async (req, res) => {
  const usernameQuery = req.query.q;

  // const users = await User.find({
  //   username: { $regex: usernameQuery, $options: 'i' }
  // });
  const users = await new QueryPG(pool).find(
    '*',
    'users WHERE username LIKE ($1)',
    [`${usernameQuery}%`],
    true
  );

  users.forEach((user) => {
    user.password = undefined;
  });

  // Send Response
  res.status(200).json({
    results: users.length,
    users,
    status: 'success'
  });
});
