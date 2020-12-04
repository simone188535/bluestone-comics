// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
// const Issues = require('../models/issueModel');
const Issue = require('../models/issueModel');

class SearchFeatures {
  constructor(query, queryString, textSearch = false) {
    this.query = query;
    this.queryString = queryString;
    this.textSearch = textSearch;
  }

  filter() {
    const queryObj = { ...this.queryString };

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|eq|ne)\b/g,
      (match) => `$${match}`
    );

    let searchQuery = {};
    // let queryProjection = {};

    if (this.textSearch) {
      if (this.queryString.q) {
        // if queryString.q /text search is present, do a text search and add queryProjection for assist sorting

        searchQuery = Object.assign(searchQuery, {
          $text: { $search: this.queryString.q }
        });

        // queryProjection = Object.assign(queryProjection, {
        //   score: { $meta: 'textScore' }
        // });
      } else {
        // if queryString.q is present but, is empty, Show all results, do not add queryProjection

        searchQuery = Object.assign(searchQuery, { _id: { $exists: true } });
        // queryProjection = null;
      }
    } else {
      // search altered query string and parse, do not add queryProjection

      searchQuery = JSON.parse(queryStr);
      // queryProjection = null;
    }

    // console.log('searchFeatures this', queryProjection);
    this.query = this.query.find(searchQuery);
    // console.log('searchFeatures this', this.query);
    return this;
  }

  sort(defaultValue) {
    const sortQuery = {};

    if (this.queryString.q) {
      Object.assign(sortQuery, {
        score: { $meta: 'textScore' }
      });
    }

    if (this.queryString.sort) {
      // sort when values are provided

      // make an array of the sort values
      const sortBy = this.queryString.sort.split(',');

      sortBy.forEach((sortByValue) => {
        /*
        If you ever decide to use Descending sorts add a conditional which checks if theres a - (i.g. -test) 
        in the value (by using .includes()). Then use .split() to seperate by the - sign. then assign the value 
        to this. const sortByObject = { [sortBy[index]]: -1 };
        */
        const sortByObject = { [sortByValue]: 1 };
        Object.assign(sortQuery, sortByObject);
      });

      this.query = this.query.sort(sortQuery);
    } else {
      // sort when no values are provided
      const defaultSort = defaultValue || 'dateCreated';

      Object.assign(sortQuery, {
        [defaultSort]: 1
      });

      this.query = this.query.sort(sortQuery);
    }

    return this;
  }

  limitFields() {
    // Removes or shows certain fields
    // This field needs to be enabled if this.queryString.q / text search
    const limitQuery = {};

    if (this.queryString.q) {
      Object.assign(limitQuery, {
        score: { $meta: 'textScore' }
      });
    }

    // DO NOT DELETE, MAY NEED EVETUALLY
    // if (this.queryString.fields) {
    //   const fields = this.queryString.fields.split(',');
    //   console.log('fields', fields);
    //   fields.forEach((fieldValue) => {
    //     /*
    //     If you ever decide to use Descending sorts add a conditional which checks if theres a - (i.g. -test) 
    //     in the value (by using .includes()). Then use .split() to seperate by the - sign. then assign the value 
    //     to this. const sortByObject = { [sortBy[index]]: -1 };
    //     */
    //     const sortByObject = { [fieldValue]: 1 };
    //     Object.assign(limitQuery, sortByObject);
    //   });

    //   this.query = this.query.select(limitQuery);
    // } else {
    //   this.query = this.query.select(limitQuery);
    // }
    this.query = this.query.select(limitQuery);

    return this;
  }

  paginate(defaultLimit) {
    const page = this.queryString.page * 1 || 1;
    const limit = (this.queryString.limit || defaultLimit) * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
exports.search = catchAsync(async (req, res, next) => {
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
    .paginate(10);

  // Execute Query
  const doc = await searchResults.query;
  // const books = await query;
  // await search.populate('publisher');

  // Send Response
  res.status(200).json({
    results: doc.length,
    books: doc,
    status: 'success'
  });
});

exports.searchBooks = catchAsync(async (req, res) => {
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
