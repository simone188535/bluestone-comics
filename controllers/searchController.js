// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Issue = require('../models/issueModel');
const SearchFeatures = require('../utils/SearchFeatures');

exports.searchBooks = catchAsync(async (req, res, next) => {
  // // 1) Filtering
  // const queryObj = { ...req.query };
  // // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // // excludedFields.forEach((el) => delete queryObj[el]);

  // // 1A) Advanced Filtering
  // // console.log('queryObj', queryObj);
  // let queryStr = JSON.stringify(queryObj);

  // // Where I found the code to filter comparison operator (gt,gte) ect: https://stackoverflow.com/questions/37709927/how-to-filter-a-query-string-with-comparison-operators-in-express
  // queryStr = queryStr.replace(
  //   /\b(gt|gte|lt|lte|eq|ne)\b/g,
  //   (match) => `$${match}`
  // );

  // // console.log('queryStr', queryStr);

  // // 2) Sorting
  // const sort = {};

  // if (req.query.q) {
  //   sort.score = { $meta: 'textScore' };
  // }

  // if (req.query.sort) {
  //   if (req.query.sort === 'newest') {
  //     // Latest/Newest entry
  //     sort.lastUpdate = 1;
  //   } else if (req.query.sort === 'popular') {
  //     // Most Popular
  //     sort.popular = 1;
  //   } else if (req.query.sort === 'views') {
  //     // Most Views
  //     sort.views = 1;
  //   } else if (req.query.sort === 'likes') {
  //     // Most Likes
  //     sort.likes = 1;
  //   }
  // } else {
  //   // sort by Latest/Newest entry
  //   sort.lastUpdate = 1;
  // }

  // // console.log('sort', sort);

  // // 4) Text Search
  // queryStr = JSON.parse(queryStr);
  // if (req.query.q) {
  //   queryStr.$text = { $search: `${req.query.q}` };
  // }

  // // removes unneeded value from queryStr object
  // delete queryStr.q;
  // delete queryStr.sort;

  // console.log('queryStr', queryStr);
  // //console.log(JSON.parse(queryStr));

  // // may need to query populated publisher field for given author
  // // https://mongoosejs.com/docs/populate.html
  // // Maybe search users collection seperately as well
  // const books = await Book.find(
  //   queryStr,
  //   // helps sort text results by relevance
  //   { score: { $meta: 'textScore' } }
  // ).sort(sort);
  // // .sort({ score: { $meta: 'textScore' } });
  // // console.log('query', query);
  const searchResults = new SearchFeatures(Book.find(), req.query, true)
    .filter()
    .sort('lastUpdate')
    .limitFields()
    .paginate();

  // Execute Query
  const doc = await searchResults.query.populate('publisher');
  // const books = await query;
  // await search.populate('publisher');

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
  const doc = await searchResults.query.populate('publisher');
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

  const users = await User.find({
    username: { $regex: usernameQuery, $options: 'i' }
  });

  // Send Response
  res.status(200).json({
    results: users.length,
    users,
    status: 'success'
  });
});
