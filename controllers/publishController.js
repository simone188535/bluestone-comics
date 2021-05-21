// const User = require('../models/userModel');
// const multer = require('multer');
// const AmazonSDKS3 = require('../utils/AmazonSDKS3');
const Book = require('../models/bookModel');
const Issue = require('../models/issueModel');
const WorkCredits = require('../models/workCreditsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const QueryPG = require('../utils/QueryPGFeature');
const pool = require('../db');

// THESE CONTROLLERS ARE FOR A USER WHO CREATES BOOKS OR ARTICLES
exports.getBookAndIssues = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const bookByUser = await Book.findOne({
    _id: bookId,
    publisher: res.locals.user.id
  }).populate('publisher');

  // Get book and issues.
  res.status(200).json({
    status: 'success',
    book: bookByUser
  });
});

// This creates both the book and the first Issue
exports.createBook = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  // console.log('body', req.body);

  // // Filtered out unwanted fields
  // const filterBody = filterObj(
  //   req.body,
  //   'bookTitle',
  //   'urlSlug',
  //   'bookDescription',
  //   'issueTitle'
  // );

  // console.log('body', req.body);
  // console.log('filterBody', filterBody);

  const {
    bookTitle,
    urlSlug,
    // bookCoverPhoto,
    bookDescription,
    genres,
    issueTitle,
    // issueCoverPhoto,
    // issueAssets,
    workCredits
  } = req.body;

  // const newBook = new Book({
  //   publisher: res.locals.user.id,
  //   title: bookTitle,
  //   urlSlug,
  //   coverPhoto: bookCoverPhoto,
  //   description: bookDescription,
  //   genres
  // });

  // grab AWS file prefix(where the file is saved) and save it to the db (each of these files should share the same one)
  const AWSPrefixArray = req.files.bookCoverPhoto[0].key.split('/');

  // save these to models .......
  // console.log('bookCoverPhoto:', req.files.bookCoverPhoto);
  // console.log('issueCoverPhoto:', req.files.issueCoverPhoto);
  // console.log('issueAssets:', req.files.issueAssets);

  // newIssue.issueAssets = req.files.issueAssets.map(
  //   (issueAsset) => issueAsset.location
  // );

  const insertBook =
    'books(publisher_id, title, url_slug, cover_photo, description, image_prefix_reference)';
  const bookPreparedStatement = '$1, $2, $3, $4, $5, $6';

  const bookValues = [
    res.locals.user.id,
    bookTitle,
    urlSlug,
    req.files.bookCoverPhoto[0].location,
    bookDescription,
    AWSPrefixArray[0]
  ];

  const newBook = await new QueryPG(pool).insert(
    insertBook,
    bookPreparedStatement,
    bookValues
  );

  // const newIssue = new Issue({
  //   publisher: res.locals.user.id,
  //   book: newBook.id,
  //   title: issueTitle,
  //   coverPhoto: issueCoverPhoto,
  //   totalPages: req.files.issueAssets.length,
  //   issueAssets
  // });

  const insertIssue =
    'issues(publisher_id, book_id, title, cover_photo, image_prefix_reference)';
  const issuePreparedStatement = '$1, $2, $3, $4, $5';

  const issueValues = [
    res.locals.user.id,
    newBook.id,
    issueTitle,
    req.files.issueCoverPhoto[0].location,
    AWSPrefixArray[1]
  ];

  const newIssue = await new QueryPG(pool).insert(
    insertIssue,
    issuePreparedStatement,
    issueValues
  );

  console.log('newBook: ', newBook, 'newIssue: ', newIssue);

  const newIssueAssets = [];
  const insertIssueAssets =
    'issue_assets(publisher_id, book_id, issue_id, page_number, photo_url)';
  const issueAssetsPreparedStatement = '$1, $2, $3, $4, $5';

  req.files.issueAssets.forEach(async (issueAsset, index) => {
    // this will have to be added iteratively, probably with a nested for loop
    // issueAsset.credits.forEach(async (credit) => {
    const issueAssetsValues = [
      res.locals.user.id,
      newBook.id,
      newIssue.id,
      index,
      issueAsset.location
    ];
    const addedIssueAsset = await new QueryPG(pool).insert(
      insertIssueAssets,
      issueAssetsPreparedStatement,
      issueAssetsValues
    );

    newIssueAssets.push(addedIssueAsset);
    console.log('addedIssueAsset: ', addedIssueAsset);
    // });
  });

  // const newWorkCredits = new WorkCredits({
  //   publisher: res.locals.user.id,
  //   book: newBook.id,
  //   issue: newIssue.id,
  //   workCredits: parsedWorkCredits
  // });

  // add work edits to db
  // The objects in workCredits are stringified and need to be parsed before adding the data to the schema
  const parsedWorkCredits = JSON.parse(workCredits);

  console.log('parsedWorkCredits: ', parsedWorkCredits);
  const newWorkCredits = [];
  const insertWorkCredits =
    'work_credits(publisher_id, book_id, issue_id, creator_id, creator_credit)';
  const workCreditsPreparedStatement = '$1, $2, $3, $4, $5';

  parsedWorkCredits.forEach((workCredit) => {
    // this will have to be added iteratively, probably with a nested for loop
    workCredit.credits.forEach(async (credit) => {
      const workCreditsValues = [
        res.locals.user.id,
        newBook.id,
        newIssue.id,
        workCredit.user,
        credit.toLowerCase()
      ];
      const addedWorkCredit = await new QueryPG(pool).insert(
        insertWorkCredits,
        workCreditsPreparedStatement,
        workCreditsValues
      );

      newWorkCredits.push(addedWorkCredit);
      // console.log('addedWorkCredits:', addedWorkCredits);
    });
  });

  // Change user role to creator
  const updatedUser = await new QueryPG(pool).update(
    'users',
    'role = ($1)',
    'id = ($2)',
    ['creator', res.locals.user.id]
  );

  res.locals.user = updatedUser;

  console.log(
    'newBook: ',
    newBook,
    'newIssue: ',
    newIssue,
    'parsedWorkCredits: ',
    parsedWorkCredits
  );
  res.status(201).json({
    status: 'success',
    book: newBook,
    issue: newIssue,
    issueAssets: newIssueAssets,
    workcredits: newWorkCredits
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const existingBookByCurrentUser = await Book.findOne({
    _id: bookId,
    publisher: res.locals.user.id
  });
  if (!existingBookByCurrentUser) {
    next(new AppError(`Existing book cannot be found.`, 401));
  }
  // delete existing Issues of Book by user
  await Issue.deleteMany({
    publisher: res.locals.user.id,
    book: bookId
  });

  // delete the book
  await Book.deleteOne({
    _id: bookId,
    publisher: res.locals.user.id
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
    'description',
    'urlSlug',
    'status',
    'removed'
  );

  // edit any issue of a book
  const updatedBook = await Book.findOneAndUpdate(
    {
      _id: bookId,
      publisher: res.locals.user.id
    },
    filterBody,
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    status: 'success',
    updatedBook
  });
});

// Get Issue
// exports.getIssue = catchAsync(async (req, res, next) => {
//   res.status(200).json({
//     status: 'success'
//   });
// });

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
    publisher: res.locals.user.id
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
    publisher: res.locals.user.id,
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
    publisher: res.locals.user.id
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
    publisher: res.locals.user.id,
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
      publisher: res.locals.user.id,
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
