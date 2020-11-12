// const express = require('express');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const User = require('../models/userModel');
const Book = require('../models/bookModel');
// const Issue = require('../models/issueModel');

exports.search = catchAsync(async (req, res, next) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // console.log('req.query', req.query);
  // 2) Advanced Filtering
  console.log('queryObj', queryObj);
  let queryStr = JSON.stringify(queryObj);

  // Where I found the code to filter comparison operator (gt,gte) ect: https://stackoverflow.com/questions/37709927/how-to-filter-a-query-string-with-comparison-operators-in-express
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|eq|ne)\b/g,
    (match) => `$${match}`
  );
  console.log('queryStr', queryStr);
  console.log(JSON.parse(queryStr));
  // may need to query populated publisher field for given author
  // https://mongoosejs.com/docs/populate.html
  // Maybe search users collection seperately as well
  const books = await Book.find(JSON.parse(queryStr));
  // console.log('query', query);

  // Execute Query
  // const books = await query;

  // Send Response
  res.status(200).json({
    results: books.length,
    books,
    status: 'success'
  });
});
