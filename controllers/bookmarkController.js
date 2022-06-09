const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QueryPG = require('../utils/QueryPGFeature');
const pool = require('../db');

exports.getBookmark = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const existingBookmarkByUser = await new QueryPG(pool).find(
    'book_id, subscribed_id',
    'bookmarks WHERE book_id = $1 AND subscribed_id = $2',
    [bookId, res.locals.user.id]
  );

  res.status(200).json({
    status: 'success',
    bookmark: existingBookmarkByUser
  });
});

// get all bookmarks for current user
exports.getAllBookmarks = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const existingBookmarkByUser = await new QueryPG(pool).find(
    'book_id, subscribed_id',
    'bookmarks WHERE book_id = $1 AND subscribed_id = $2',
    [bookId, res.locals.user.id],
    true
  );

  res.status(200).json({
    status: 'success',
    bookmark: existingBookmarkByUser
  });
});

exports.createBookmark = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const existingBookmarkByUser = await new QueryPG(pool).find(
    '*',
    'bookmarks WHERE book_id = $1 AND subscribed_id = $2',
    [bookId, res.locals.user.id]
  );

  if (existingBookmarkByUser) {
    return next(
      new AppError(`This user already has a bookmark for this work.`, 404)
    );
  }
  const newBookmark = await new QueryPG(pool).insert(
    'bookmarks(subscribed_id, book_id, date_created)',
    '$1, $2, $3',
    [res.locals.user.id, bookId, new Date()]
  );

  res.status(201).json({
    status: 'success',
    bookmark: newBookmark
  });
});

exports.deleteBookmark = catchAsync(async (req, res) => {});
