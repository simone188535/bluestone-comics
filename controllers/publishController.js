const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
// const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Issue = require('../models/issueModel');

// This creates both the book and the first Issue
exports.createBook = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  // console.log(req.user);
  const {
    bookTitle,
    urlSlug,
    bookCoverPhoto,
    bookDescription,
    genres,
    issueTitle,
    issueCoverPhoto,
    issueAssets,
    workCredits
  } = req.body;

  const newBook = await Book.create({
    publisher: req.user.id,
    title: bookTitle,
    urlSlug,
    coverPhoto: bookCoverPhoto,
    description: bookDescription,
    genres,
    workCredits
  });

  const newIssue = await Issue.create({
    publisher: req.user.id,
    book: newBook.id,
    title: issueTitle,
    coverPhoto: issueCoverPhoto,
    issueAssets,
    workCredits
  });

  // Change user role to creator !!!!!!!!!!!!!

  // const populated = await User.findOne({ _id: req.user.id }).populate(
  //   'publisher'
  // );
  // console.log('!!!!!!!', populated);
  // const populated = await User.findOne({ _id: req.user.id }).populate(
  //   'publisher'
  // );
  // console.log('!!!!!!!', populated);
  res.status(201).json({
    status: 'success',
    book: newBook,
    issue: newIssue
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const existingBookByCurrentUser = await Book.findOne({
    _id: bookId,
    publisher: req.user.id
  });
  if (!existingBookByCurrentUser) {
    next(new AppError(`Existing book cannot be found.`, 401));
  }
  // delete existing Issues of Book by user
  await Issue.deleteMany({
    publisher: req.user.id,
    book: bookId
  });

  // delete the book
  await Book.deleteOne({
    _id: bookId,
    publisher: req.user.id
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  // Filtered out unwanted fields
  const filterBody = filterObj(
    req.body,
    'coverPhoto',
    'title',
    'genres',
    'description'
  );
  // console.log('!!!!!!!!', filterBody);
  // edit any issue of a book
  const updatedBook = await Book.findOneAndUpdate(
    {
      _id: bookId,
      publisher: req.user.id
    },
    filterBody,
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    status: 'success',
    updatedBook
  });
});

// This creates a new issue and increments the total number of issues in a book
exports.createIssue = catchAsync(async (req, res, next) => {
  const { issueTitle, issueCoverPhoto, issueAssets, workCredits } = req.body;
  const { bookId } = req.params;

  /* 
  The reason findOneAndUpdate was not used for incrementing here is because the 
  same functionality in the adjustTotalIssue instance method may need to be
  used elsewhere it makes since to define it where it can be reused (within the Model)
  */
  const existingBookByCurrentUser = await Book.findOne({
    _id: bookId,
    publisher: req.user.id
  });
  if (!existingBookByCurrentUser) {
    next(
      new AppError(`Existing book not found. Cannot create new issue.`, 401)
    );
  }
  existingBookByCurrentUser.adjustTotalIssue('increment');
  await existingBookByCurrentUser.save();

  // calculates the total pages of assets provided
  let totalPages = 0;
  issueAssets.forEach(() => {
    totalPages += 1;
  });

  const newIssue = await Issue.create({
    publisher: req.user.id,
    book: existingBookByCurrentUser.id,
    title: issueTitle,
    coverPhoto: issueCoverPhoto,
    issueAssets,
    // This makes totalIssues (from Book Model) and the current issueNumber(from Issue Model) consistent
    issueNumber: existingBookByCurrentUser.totalIssues,
    totalPages,
    workCredits
  });

  res.status(201).json({
    status: 'success',
    book: existingBookByCurrentUser,
    newIssue
  });
});

// This deletes an existing issue and decrements the total number of issues in a book
exports.deleteIssue = catchAsync(async (req, res, next) => {
  // const { urlSlug, bookId } = req.params;
  const { bookId, issueNumber } = req.params;

  /* 
  The reason findOneAndUpdate was not used for decrementing here is because the 
  same functionality in the adjustTotalIssue instance method may need to be
  used elsewhere it makes since to define it where it can be reused (within the Model)
  */
  // Find existing book
  const existingBookByCurrentUser = await Book.findOne({
    _id: bookId,
    publisher: req.user.id
  });
  if (!existingBookByCurrentUser) {
    next(
      new AppError(
        `Existing book cannot be found. Issue cannot be deleted.`,
        401
      )
    );
  }
  // find existing issue and delete it
  const existingIssueByCurrentUser = await Issue.findOneAndDelete({
    publisher: req.user.id,
    book: bookId,
    issueNumber
  });

  if (!existingIssueByCurrentUser) {
    next(new AppError(`Existing issue cannot be found.`, 401));
  }

  existingBookByCurrentUser.adjustTotalIssue('decrement');
  await existingBookByCurrentUser.save();

  // If all issues are deleted remove book
  if (existingBookByCurrentUser.totalIssues === 0) {
    await Book.deleteOne(existingBookByCurrentUser);
  }

  res.status(204).json({
    status: 'success'
  });
});

exports.updateIssue = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;

  // Filtered out unwanted fields
  const filterBody = filterObj(
    req.body,
    'coverPhoto',
    'title',
    'issueAssets',
    'workCredits'
  );
  // console.log('!!!!!!!!', filterBody);
  // edit any issue of a book
  const updatedIssue = await Issue.findOneAndUpdate(
    {
      publisher: req.user.id,
      book: bookId,
      issueNumber
    },
    filterBody,
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({
    status: 'success',
    updatedIssue
  });
});
