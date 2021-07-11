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
    .filter('books')
    .sort('books.')
    .paginate(20);

  // example of ts rank cd shown here: https://linuxgazette.net/164/sephton.html
  // https://stackoverflow.com/questions/32903988/postgres-ts-rank-cd-different-result-for-same-tsvector
  // ts_rank_cd('{0.1, 0.2, 0.4, 1.0}', setweight(to_tsvector('english', coalesce( books.title,'')), 'A') || setweight(to_tsvector('english', coalesce(books.description,'')), 'B'), plainto_tsquery('english', '${req.query.q}')) AS rank
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
    books.date_created
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
  const parameterizedQuery = `issues INNER JOIN users ON (users.id = issues.publisher_id) INNER JOIN books ON (books.id = issues.book_id)`;
  const { query, parameterizedValues } = new SearchQueryStringFeatures(
    parameterizedQuery,
    req.query,
    []
  )
    .filter('issues')
    .sort('issues.')
    .paginate(20);

  //  ts_rank_cd('{0.1, 0.2, 0.4, 1.0}', setweight(to_tsvector('english', coalesce(issues.title,'')), 'A'), plainto_tsquery('english', '${req.query.q}')) AS rank
  const issues = await new QueryPG(pool).find(
    `issues.title,
    issues.issue_number,
    issues.date_created,
    users.username,
    users.email,
    users.user_photo`,
    query,
    parameterizedValues,
    true
  );

  // Send Response
  res.status(200).json({
    results: issues.length,
    issues,
    status: 'success'
  });
});

exports.search = catchAsync(async (req, res) => { });

exports.searchUsers = catchAsync(async (req, res) => {
  const usernameQuery = req.query.q;

  // const users = await User.find({
  //   username: { $regex: usernameQuery, $options: 'i' }
  // });
  // const parameterizedQuery = `users`;
  // const { query, parameterizedValues } = new SearchQueryStringFeatures(
  //   parameterizedQuery,
  //   req.query,
  //   []
  // )
  //   .filter('users')
  //   .sort('users.')
  //   .paginate(20);

  //   console.log('query ', query);
  //   console.log('parameterizedValues ', parameterizedValues);
  // const users = await new QueryPG(pool).find(
  //   `*,  similarity(username, '${req.query.q}') AS rank`,
  //   query,
  //   parameterizedValues,
  //   true
  // );

  const users = await new QueryPG(pool).find(
    'id, username, user_photo, date_created',
    'users WHERE username LIKE ($1)',
    [`${usernameQuery}%`],
    true
  );

  // Send Response
  res.status(200).json({
    results: users.length,
    users,
    status: 'success'
  });
});
