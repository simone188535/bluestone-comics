const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QueryPG = require('../utils/QueryPGFeature');
const { pool } = require('../db');

exports.getBookmark = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const existingBookmarkByUser = await new QueryPG(pool).find(
    'book_id, subscribed_id',
    'bookmarks WHERE book_id = $1 AND subscribed_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!existingBookmarkByUser) {
    return next(new AppError(`This bookmark doesn't exist.`, 404));
  }

  res.status(200).json({
    status: 'success',
    bookmark: existingBookmarkByUser
  });
});

// get all bookmarks for current user
exports.getAllBookmarks = catchAsync(async (req, res) => {
  const { subscriberId } = req.params;
  const existingBookmarkByUser = await new QueryPG(pool).find(
    'books.id AS book_Id, title AS book_title, url_slug, cover_photo, books.date_created',
    'bookmarks INNER JOIN books ON bookmarks.book_id = books.id INNER JOIN users ON bookmarks.subscribed_id = users.id WHERE subscribed_id = $1 ORDER BY bookmarks.date_created DESC',
    [subscriberId],
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

exports.deleteBookmark = catchAsync(async (req, res) => {
  const { bookId } = req.params;

  await new QueryPG(pool).delete(
    'bookmarks',
    'subscribed_id = ($1) AND book_id = ($2)',
    [res.locals.user.id, bookId]
  );

  res.status(204).json({
    status: 'success'
  });
});
