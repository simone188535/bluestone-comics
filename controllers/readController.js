// const uuid = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const keys = require('../config/keys');
const AmazonSDKS3 = require('../utils/AmazonSDKS3');
// const filterObj = require('../utils/filterObj');
const QueryPG = require('../utils/QueryPGFeature');
// const pageOffset = require('../utils/offset');
const pool = require('../db');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  // edit any issue of a book
  // const books = await Book.find({});
  // res.status(200).json({
  //   results: books.length,
  //   books,
  //   status: 'success'
  // });
});
exports.getBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const bookByUser = await new QueryPG(pool).find(
    'users.username, publisher_id, title AS book_title, url_slug, cover_photo, description, status, removed, image_prefix_reference, books.last_updated, books.date_created',
    'books INNER JOIN users ON books.publisher_id = users.id WHERE books.id = $1 AND books.publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!bookByUser) {
    return next(
      new AppError(`Existing book by the current user cannot be found.`, 404)
    );
  }
  // Get the book cover photo file in AWS associated with this book
  const bookCoverPhoto = await AmazonSDKS3.getSingleS3Object(
    AmazonSDKS3.getS3FilePath(bookByUser.cover_photo)
  );

  // Get book and issues.
  res.status(200).json({
    status: 'success',
    book: bookByUser,
    bookCoverPhoto
  });
});

exports.getIssue = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;

  const issueOfBookByUser = await new QueryPG(pool).find(
    'users.username, books.status, books.title AS book_title, issues.id AS issue_id, issues.publisher_id, issues.book_id,  issues.title AS issue_title,  issues.cover_photo,  issues.issue_number,  issues.image_prefix_reference, issues.last_updated, issues.date_created, issues.description',
    'issues INNER JOIN users ON issues.publisher_id = users.id INNER JOIN books ON books.publisher_id = users.id WHERE issues.book_id = ($1) AND issues.publisher_id = ($2) AND issue_number = ($3)',
    [bookId, res.locals.user.id, issueNumber]
  );

  if (!issueOfBookByUser) {
    return next(new AppError(`Existing Issue not found. `, 404));
  }
  const issueAssets = await new QueryPG(pool).find(
    '*',
    'issue_assets WHERE book_id = ($1) AND publisher_id = ($2) AND issue_id = ($3) ORDER BY page_number ASC',
    [bookId, res.locals.user.id, issueOfBookByUser.issue_id],
    true
  );

  // Get all AWS Objects for issue assets
  const issueAssetFiles = await Promise.all(
    issueAssets.map(
      async (issueAsset) =>
        await AmazonSDKS3.getSingleS3Object(
          AmazonSDKS3.getS3FilePath(issueAsset.photo_url)
        )
    )
  );

  res.status(200).json({
    status: 'success',
    issue: issueOfBookByUser,
    issueAssets,
    totalIssueAssets: issueAssets.length,
    issueAssetFiles
  });
});

exports.getIssues = catchAsync(async (req, res, next) => {
  // Find issues of a book
  res.status(200).json({
    status: 'success'
  });
});

exports.getWorkCredits = catchAsync(async (req, res, next) => {
  // Find issue of a book
  res.status(200).json({
    status: 'success'
  });
});

exports.getGenresForBook = catchAsync(async (req, res, next) => {
  // const { bookId } = req.params;
  // const bookByUser = await new QueryPG(pool).find(
  //   'users.username, publisher_id, title AS book_title, url_slug, cover_photo, description, status, removed, image_prefix_reference, books.last_updated, books.date_created',
  //   'books INNER JOIN users ON books.publisher_id = users.id WHERE books.id = $1 AND books.publisher_id = $2',
  //   [bookId, res.locals.user.id]
  // );

  // if (!bookByUser) {
  //   return next(
  //     new AppError(`Existing book by the current user cannot be found.`, 404)
  //   );
  // }
  // // Get the book cover photo file in AWS associated with this book
  // const bookCoverPhoto = await AmazonSDKS3.getSingleS3Object(
  //   AmazonSDKS3.getS3FilePath(bookByUser.cover_photo)
  // );

  // Get book and issues.
  res.status(200).json({
    status: 'success'
    // book: bookByUser,
    // bookCoverPhoto
  });
});
