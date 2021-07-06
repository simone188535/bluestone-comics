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
  const { query, parameterizedValues } = new SearchQueryStringFeatures(
    parameterizedQuery,
    req.query,
    []
  )
    .filter()
    .sort('books.')
    .paginate(20);
  // BUG dont for get coalesce to ts rank
  // BUG dont forget to add an index for this text search

  // example of ts rank cd shown here: https://linuxgazette.net/164/sephton.html
  // ts_rank_cd( to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')), plainto_tsquery('english', '${req.query.q}')) as rank
  const books = await new QueryPG(pool).find(
    `users.id,
    users.username,
    users.user_photo,
    books.title, 
    books.url_slug, 
    books.cover_photo, 
    books.description, 
    books.status, 
    books.last_updated, 
    books.date_created,
    ts_rank_cd('{0.1, 0.2, 0.4, 1.0}', setweight(to_tsvector('english', coalesce(title,'')), 'A') || setweight(to_tsvector('english', coalesce(description,'')), 'B'), plainto_tsquery('english', '${req.query.q}')) as rank
   `,
    query,
    parameterizedValues,
    true
  );

  // Send Response
  res.status(200).json({
    results: books.length,
    books,
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

exports.search = catchAsync(async (req, res) => {});

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
