// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const pool = require('../db');
const QueryPG = require('../utils/QueryPGFeature');
const SearchFeatures = require('../utils/SearchFeatures');
const { withGenresStr } = require('../utils/SearchFeaturesHelpers');

// TODO: may implement this in our pagination later: https://ivopereira.net/efficient-pagination-dont-use-offset-limit , https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
exports.searchBooks = catchAsync(async (req, res, next) => {
  const parameterizedQuery = `books INNER JOIN users ON (users.id = books.publisher_id) INNER JOIN workGenres ON (workGenres.genre_book_id = books.id)`;

  // const searchBookFilter = new SearchFeatures(
  //   parameterizedQuery,
  //   req.query,
  //   []
  // ).filter('books.title ILIKE $ OR books.description ILIKE $')
  // .sort('books')
  // .paginate(20);

  const searchBookFilter = new SearchFeatures(
    parameterizedQuery,
    req.query,
    []
  ).filter('books.title ILIKE $ OR books.description ILIKE $');

  const { count } = await new QueryPG(pool).find(
    `COUNT(DISTINCT books.id)`,
    searchBookFilter.query,
    searchBookFilter.parameterizedValues,
    false,
    `${withGenresStr}`
  );

  const searchBook = searchBookFilter.sort('books').paginate(20);

  const books = await new QueryPG(pool).find(
    `users.id AS user_id,
    users.username,
    users.user_photo,
    books.id AS book_id,
    books.title AS book_title, 
    books.url_slug, 
    books.cover_photo, 
    books.description, 
    books.status, 
    books.last_updated, 
    books.date_created,
    books.content_rating,
    workGenres.genre_array
   `,
    searchBook.query,
    searchBook.parameterizedValues,
    true,
    `${withGenresStr}`
  );

  // Send Response
  res.status(200).json({
    type: 'books',
    totalResultCount: Number(count),
    currentResultCount: books.length,
    books,
    status: 'success'
  });
});

exports.searchIssues = catchAsync(async (req, res) => {
  const parameterizedQuery = `issues INNER JOIN users ON (users.id = issues.publisher_id) INNER JOIN books ON (books.id = issues.book_id) INNER JOIN workGenres ON (workGenres.genre_book_id = books.id)`;

  const searchIssueFilter = new SearchFeatures(
    parameterizedQuery,
    req.query,
    []
  ).filter('issues.title ILIKE $ OR issues.description ILIKE $');

  const { count } = await new QueryPG(pool).find(
    `COUNT(DISTINCT issues.id)`,
    searchIssueFilter.query,
    searchIssueFilter.parameterizedValues,
    false,
    `${withGenresStr}`
  );

  const searchIssue = searchIssueFilter.sort('issues').paginate(20);

  const issues = await new QueryPG(pool).find(
    `users.id AS user_id,
    users.username,
    users.email,
    users.user_photo,
    issues.id AS issue_id,
    issues.title AS issue_title,
    issues.description,
    issues.cover_photo,
    issues.issue_number,
    issues.date_created,
    books.id AS book_id,
    books.title AS book_title,
    books.url_slug,
    books.content_rating,
    workGenres.genre_array
    `,
    searchIssue.query,
    searchIssue.parameterizedValues,
    true,
    `${withGenresStr}`
  );

  // Send Response
  res.status(200).json({
    type: 'issues',
    totalResultCount: Number(count),
    currentResultCount: issues.length,
    issues,
    status: 'success'
  });
});

exports.search = catchAsync(async (req, res) => {});

exports.searchUsers = catchAsync(async (req, res) => {
  const parameterizedQuery = `users`;
  const searchUsersFilter = new SearchFeatures(
    parameterizedQuery,
    req.query,
    [],
    false
  ).filter('users.username ILIKE $');

  const { count } = await new QueryPG(pool).find(
    `COUNT(users.id)`,
    searchUsersFilter.query,
    searchUsersFilter.parameterizedValues,
    false
  );

  const searchUsers = searchUsersFilter.sort('users').paginate(20);

  const users = await new QueryPG(pool).find(
    'id, username, user_photo, date_created',
    searchUsers.query,
    searchUsers.parameterizedValues,
    true
  );

  // Send Response
  res.status(200).json({
    type: 'users',
    totalResultCount: Number(count),
    currentResultCount: users.length,
    users,
    status: 'success'
  });
});

exports.searchAccreditedWorks = catchAsync(async (req, res) => {
  const { userId } = req.query;

  // issue_id, creator_credit
  const accreditedWorksQuery =
    'work_credits INNER JOIN issues ON (work_credits.issue_id = issues.id) INNER JOIN books ON (work_credits.book_id = books.id) WHERE creator_id = ($1) AND creator_credit = ($2)';

  const accreditedWorksSelectedData =
    'issues.book_id, issues.date_created, issues.issue_number, issues.title AS issue_title, work_credits.issue_id, work_credits.creator_credit, books.id, books.title AS book_title';

  const writer = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'writer'],
    true
  );

  const artist = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'artist'],
    true
  );

  const editor = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'editor'],
    true
  );

  const inker = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'inker'],
    true
  );

  const letterer = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'letterer'],
    true
  );

  const penciller = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'penciller'],
    true
  );

  const colorist = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'colorist'],
    true
  );

  const coverArtist = await new QueryPG(pool).find(
    accreditedWorksSelectedData,
    accreditedWorksQuery,
    [userId, 'cover artist'],
    true
  );
  res.status(200).json({
    writer,
    artist,
    editor,
    inker,
    letterer,
    penciller,
    colorist,
    coverArtist,
    status: 'success'
  });
});
