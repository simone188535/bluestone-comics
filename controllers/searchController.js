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
  // const searchResults = new SearchFeatures(Book.find(), req.query, true)
  //   .filter()
  //   .sort('lastUpdate')
  //   .limitFields()
  //   .paginate();

  // Execute Query
  // const doc = await searchResults.query;
  let joinClause = '';
  let whereClause = '';
  let parameterizedValues = null;

  // if a text search is in place
  if (req.query.q) {
    joinClause = 'INNER JOIN users ON (users.id = books.publisher_id)';
    whereClause = 'WHERE title ILIKE ($1) OR  description ILIKE ($2)';
    parameterizedValues = [`${req.query.q}%`, `${req.query.q}%`];
    // Maybe try using this: https://stackoverflow.com/a/7005332/6195136
    // whereClause = 'WHERE title = ($1) OR description = ($2) ';
    // parameterizedValues = [req.query.q, req.query.q];
  }

  const parameterizedQuery = `books ${joinClause} ${whereClause}`;

  const parameterizedQueryString = new SearchQueryStringFeatures(
    parameterizedQuery,
    req.query
  )
    .sort('books.')
    .paginate(20);
  console.log('parameterizedQueryString ', parameterizedQueryString);
  // const doc = await new QueryPG(pool).find(
  //   '*',
  //   'books WHERE id = ($1)',
  //   ['*'],
  //   true
  // );
  const doc = await new QueryPG(pool).find(
    '*',
    parameterizedQuery,
    parameterizedValues,
    true
  );

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
  // THIS IS NOT IN USE.
  // search for provided query (q) or return everything
  const textSearchQuery = req.query.q
    ? { $text: { $search: req.query.q } }
    : { _id: { $exists: true } };

  // $match $or example https://stackoverflow.com/questions/38359622/mongoose-aggregation-match-or-between-dates
  const aggregate = await Issue.aggregate([
    // {
    //   $match: textSearchQuery
    // },
    {
      $facet: {
        // Text search Issue
        // searchIssue: [
        //   {
        //     $match: textSearchQuery
        //   },
        //   // {
        //   //   $project: {
        //   //     _id: 0,
        //   //     score: {
        //   //       $meta: 'textScore'
        //   //     }
        //   //   }
        //   // }
        // ],

        // Search publishers
        searchPublishers: [
          {
            $lookup: {
              from: 'users',
              let: { publisher: '$publisher' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$publisher']
                    },
                    $text: {
                      $search: req.query.q
                    }
                  }
                }
              ],
              as: 'publisher!!!!'
            }
          },
          {
            $project: {
              _id: 0,
              coverPhoto: 0,
              issueNumber: 0,
              totalPages: 0,
              publisher: 0,
              book: 0,
              title: 0,
              issueAssets: 0,
              dateCreated: 0,
              workCredits: 0,
              imagePrefixReference: 0,
              __v: 0
            }
          },
          {
            $group: {
              _id: '$publisher!!!!',
              count: { $sum: 1 }
            }
          }
        ],

        // Search book
        searchBooks: [
          {
            $lookup: {
              from: 'books',
              let: { book: '$book' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$book']
                    },
                    $text: {
                      $search: req.query.q
                    }
                  }
                }
              ],
              as: 'book!!!!'
            }
          },
          {
            $project: {
              _id: 0,
              coverPhoto: 0,
              issueNumber: 0,
              totalPages: 0,
              publisher: 0,
              book: 0,
              title: 0,
              issueAssets: 0,
              dateCreated: 0,
              workCredits: 0,
              imagePrefixReference: 0,
              __v: 0
            }
          },
          {
            $group: {
              _id: '$book!!!!',
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);
  // {
  //   $lookup: {
  //     from: 'users',
  //     localField: 'publisher',
  //     foreignField: '_id',
  //     as: 'publisher!!!!',
  //   }
  // },
  // {
  //   $lookup: {
  //     from: 'books',
  //     localField: 'book',
  //     foreignField: '_id',
  //     as: 'book!!!!!',
  //   }
  // }

  // need to add a facet, combine them in an array and sort by text value: https://stackoverflow.com/a/51348446/6195136
  res.status(200).json({
    results: aggregate.length,
    aggregate,
    status: 'success'
  });
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
