// const uuid = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const keys = require('../config/keys');
// const AmazonSDKS3 = require('../utils/AmazonSDKS3');
// const filterObj = require('../utils/filterObj');
const QueryPG = require('../utils/QueryPGFeature');
// const pageOffset = require('../utils/offset');
const pool = require('../db');

const extractUsernameFromUserData = (userData) =>
  userData.map((user) => user.username);

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
  // May need a where sub query because res.locals.user.id is no longer defined, so we need to search for the user id from the book ID
  const bookByUser = await new QueryPG(pool).find(
    'users.username, publisher_id, title AS book_title, url_slug, cover_photo, description, status, removed, image_prefix_reference, books.last_updated, books.date_created, books.content_rating',
    'books INNER JOIN users ON books.publisher_id = users.id WHERE books.id = ($1) AND books.publisher_id = (SELECT publisher_id FROM books WHERE books.id = ($1))',
    [bookId]
  );

  if (!bookByUser) {
    return next(
      new AppError(`Existing book by the current user cannot be found.`, 404)
    );
  }
  // Get the book cover photo file in AWS associated with this book
  // const bookCoverPhoto = await AmazonSDKS3.getSingleS3Object(
  //   AmazonSDKS3.getS3FilePath(bookByUser.cover_photo)
  // );

  // Get book and issues.
  res.status(200).json({
    status: 'success',
    book: bookByUser
    // bookCoverPhoto
  });
});

exports.getIssue = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;
  // May need a where sub query because res.locals.user.id is no longer defined, so we need to search for the user id from the book ID
  const issueOfBookByUser = await new QueryPG(pool).find(
    'users.username, books.status, books.title AS book_title,  books.content_rating, issues.id AS issue_id, issues.publisher_id, issues.book_id,  issues.title AS issue_title,  issues.cover_photo,  issues.issue_number,  issues.image_prefix_reference, issues.last_updated, issues.date_created, issues.description',
    'issues INNER JOIN users ON issues.publisher_id = users.id INNER JOIN books ON books.publisher_id = users.id WHERE issues.book_id = ($1) AND issues.publisher_id = (SELECT publisher_id FROM books WHERE books.id = ($1)) AND issue_number = ($2)',
    [bookId, issueNumber]
  );

  if (!issueOfBookByUser) {
    return next(new AppError(`Existing Issue not found. `, 404));
  }
  const issueAssets = await new QueryPG(pool).find(
    '*',
    'issue_assets WHERE book_id = ($1) AND publisher_id = (SELECT publisher_id FROM books WHERE books.id = ($1)) AND issue_id = ($2) ORDER BY page_number ASC',
    [bookId, issueOfBookByUser.issue_id],
    true
  );

  // Get all AWS Objects for issue assets
  // const issueAssetFiles = await Promise.all(
  //   issueAssets.map(
  //     async (issueAsset) =>
  //       await AmazonSDKS3.getSingleS3Object(
  //         AmazonSDKS3.getS3FilePath(issueAsset.photo_url)
  //       )
  //   )
  // );

  res.status(200).json({
    status: 'success',
    issue: issueOfBookByUser,
    issueAssets,
    totalIssueAssets: issueAssets.length
    // issueAssetFiles
  });
});

exports.getIssues = catchAsync(async (req, res, next) => {
  // Find all issues of a book
  const { bookId } = req.params;

  const issues = await new QueryPG(pool).find(
    'issues.title, issues.issue_number, issues.date_created',
    'issues WHERE book_id = ($1) ORDER BY issue_number DESC',
    [bookId],
    true
  );

  res.status(200).json({
    status: 'success',
    allIssues: issues,
    issueTotal: issues.length
  });
});

// get a list of all the creators who have contributed to this book, and also remove duplicates
exports.getBookWorkCredits = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const getIssueWorkSelect = 'DISTINCT users.username';

  const getIssueWorkCreditsQuery =
    'work_credits INNER JOIN users ON users.id = work_credits.creator_id WHERE book_id = ($1) AND creator_credit = ($2) ORDER BY users.username ASC';

  const writersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'writer'],
    true
  );

  const writers = extractUsernameFromUserData(writersResults);

  const artistsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'artist'],
    true
  );

  const artists = extractUsernameFromUserData(artistsResults);

  const editorsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'editor'],
    true
  );

  const editors = extractUsernameFromUserData(editorsResults);

  const inkersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'inker'],
    true
  );

  const inkers = extractUsernameFromUserData(inkersResults);

  const letterersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'letterer'],
    true
  );

  const letterers = extractUsernameFromUserData(letterersResults);

  const pencillersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'penciller'],
    true
  );

  const pencillers = extractUsernameFromUserData(pencillersResults);

  const coloristsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'colorist'],
    true
  );

  const colorists = extractUsernameFromUserData(coloristsResults);

  const coverArtistsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, 'cover artist'],
    true
  );

  const coverArtists = extractUsernameFromUserData(coverArtistsResults);

  res.status(200).json({
    status: 'success',
    writers,
    artists,
    editors,
    inkers,
    letterers,
    pencillers,
    colorists,
    coverArtists
  });
});

// get a list of all the creators who have contributed to a single issue
exports.getIssueWorkCredits = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;

  const { issueId } = await new QueryPG(pool).find(
    'id AS "issueId"',
    'issues WHERE book_id = ($1) AND issue_number = ($2)',
    [bookId, issueNumber],
    false
  );

  const getIssueWorkSelect = 'users.username';

  const getIssueWorkCreditsQuery =
    'work_credits INNER JOIN users ON users.id = work_credits.creator_id WHERE book_id = ($1) AND issue_id = ($2) AND creator_credit = ($3) ORDER BY users.username ASC';

  const writersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'writer'],
    true
  );

  const writers = extractUsernameFromUserData(writersResults);

  const artistsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'artist'],
    true
  );

  const artists = extractUsernameFromUserData(artistsResults);

  const editorsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'editor'],
    true
  );

  const editors = extractUsernameFromUserData(editorsResults);

  const inkersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'inker'],
    true
  );

  const inkers = extractUsernameFromUserData(inkersResults);

  const letterersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'letterer'],
    true
  );

  const letterers = extractUsernameFromUserData(letterersResults);

  const pencillersResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'penciller'],
    true
  );

  const pencillers = extractUsernameFromUserData(pencillersResults);

  const coloristsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'colorist'],
    true
  );

  const colorists = extractUsernameFromUserData(coloristsResults);

  const coverArtistsResults = await new QueryPG(pool).find(
    getIssueWorkSelect,
    getIssueWorkCreditsQuery,
    [bookId, issueId, 'cover artist'],
    true
  );

  const coverArtists = extractUsernameFromUserData(coverArtistsResults);

  res.status(200).json({
    status: 'success',
    writers,
    artists,
    editors,
    inkers,
    letterers,
    pencillers,
    colorists,
    coverArtists
  });
});

exports.getGenres = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const genres = await new QueryPG(pool).find(
    'id, genre',
    'genres WHERE book_id = ($1)',
    [bookId],
    true
  );

  const formattedGenres = genres.map((obj) => obj.genre);

  // Get all genres
  res.status(200).json({
    status: 'success',
    genres: formattedGenres
  });
});
