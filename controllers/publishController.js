// const User = require('../models/userModel');
// const multer = require('multer');
// const AmazonSDKS3 = require('../utils/AmazonSDKS3');
const uuid = require('uuid');
const Book = require('../models/bookModel');
const Issue = require('../models/issueModel');
const WorkCredits = require('../models/workCreditsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const QueryPG = require('../utils/QueryPGFeature');
const pool = require('../db');

/*
  This method inserts new work credits into the work_credits table
*/
const addWorkCredits = async (workCredits, publisherId, bookId, issueId) => {
  // The objects in workCredits are stringified and need to be parsed before adding the data to the schema
  const newWorkCredits = [];
  const parsedWorkCredits = JSON.parse(workCredits);

  await Promise.all(
    // eslint-disable-next-line array-callback-return
    parsedWorkCredits.map(async (workCredit) => {
      await Promise.all(
        workCredit.credits.map(async (credit) => {
          const addedWorkCredit = await new QueryPG(
            pool
          ).insert(
            'work_credits(publisher_id, book_id, issue_id, creator_id, creator_credit)',
            '$1, $2, $3, $4, $5',
            [
              publisherId,
              bookId,
              issueId,
              workCredit.user,
              credit.toLowerCase()
            ]
          );

          newWorkCredits.push(addedWorkCredit);
        })
      );
    })
  );
  return newWorkCredits;
};

/*
  This method inserts the uploaded Issue Assets (By Multer/S3) into the issue_assets table
*/
const addIssueAssets = async (issueAssets, publisherId, bookId, issueId) => {
  const newIssueAssets = [];

  await Promise.all(
    issueAssets.map(async (issueAsset, index) => {
      const pageNumber = index + 1;
      const addedIssueAsset = await new QueryPG(
        pool
      ).insert(
        'issue_assets(publisher_id, book_id, issue_id, page_number, photo_url)',
        '$1, $2, $3, $4, $5',
        [publisherId, bookId, issueId, pageNumber, issueAsset.location]
      );

      newIssueAssets.push(addedIssueAsset);
    })
  );
  return newIssueAssets;
};

/*
  This method inserts an array of genres into the genres table
*/
const addGenres = async (genres, bookId) => {
  const newGenres = [];
  const parsedGenres = JSON.parse(genres);

  await Promise.all(
    parsedGenres.map(async (genre) => {
      const addedGenre = await new QueryPG(
        pool
      ).insert('genres(book_id, genre)', '$1, $2', [
        bookId,
        genre.toLowerCase()
      ]);

      newGenres.push(addedGenre);
    })
  );
  return newGenres;
};

// THESE CONTROLLERS ARE FOR A USER WHO CREATES BOOKS OR ARTICLES
exports.getBookAndIssues = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const bookByUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  const issuesOfBookByUser = await new QueryPG(pool).find(
    '*',
    'issues WHERE book_id = ($1) AND publisher_id = ($2)',
    [bookId, res.locals.user.id],
    true
  );

  // if (setImagePrefix) {
  //   res.locals.bookImagePrefix = bookByUser.image_prefix_reference;
  //   res.locals.issueImagePrefix =
  //     issuesOfBookByUser[0].image_prefix_reference;
  //   return next();
  // }

  // const bookByUser = await Book.findOne({
  //   _id: bookId,
  //   publisher: res.locals.user.id
  // }).populate('publisher');

  // Get book and issues.
  res.status(200).json({
    status: 'success',
    book: bookByUser,
    issues: issuesOfBookByUser
    // bookImagePrefix: bookByUser.image_prefix_reference,
    // issueImagePrefix: issuesOfBookByUser[0].image_prefix_reference
  });
});

// This creates both the book and the first Issue
exports.createBook = catchAsync(async (req, res, next) => {
  const {
    bookTitle,
    urlSlug,
    bookDescription,
    genres,
    issueTitle,
    workCredits
  } = req.body;

  // grab AWS file path (where the file is saved in aws) and save it to the db (each of these files should share path/location in aws)
  const AWSPrefixArray = req.files.bookCoverPhoto[0].key.split('/');

  // console.log('bookCoverPhoto:', req.files.bookCoverPhoto);
  // console.log('issueCoverPhoto:', req.files.issueCoverPhoto);
  // console.log('issueAssets:', req.files.issueAssets);

  // create new Book
  const newBook = await new QueryPG(pool).insert(
    'books(publisher_id, title, url_slug, cover_photo, description, image_prefix_reference)',
    '$1, $2, $3, $4, $5, $6',
    [
      res.locals.user.id,
      bookTitle,
      urlSlug,
      req.files.bookCoverPhoto[0].location,
      bookDescription,
      AWSPrefixArray[0] // book path
    ]
  );

  // create Issue
  const newIssue = await new QueryPG(pool).insert(
    'issues(publisher_id, book_id, title, cover_photo, image_prefix_reference)',
    '$1, $2, $3, $4, $5',
    [
      res.locals.user.id,
      newBook.id,
      issueTitle,
      req.files.issueCoverPhoto[0].location,
      AWSPrefixArray[1] // issue path
    ]
  );

  // create Issue Assets
  const newIssueAssets = await addIssueAssets(
    req.files.issueAssets,
    res.locals.user.id,
    newBook.id,
    newIssue.id
  );

  // create Work Credits
  const newWorkCredits = await addWorkCredits(
    workCredits,
    res.locals.user.id,
    newBook.id,
    newIssue.id
  );

  // create Genres
  const newGenres = await addGenres(genres, newBook.id);

  // Change user role to creator
  const updatedUser = await new QueryPG(pool).update(
    'users',
    'role = ($1)',
    'id = ($2)',
    ['creator', res.locals.user.id]
  );

  res.locals.user = updatedUser;

  res.status(201).json({
    status: 'success',
    book: newBook,
    issue: newIssue,
    issueAssets: newIssueAssets,
    workcredits: newWorkCredits,
    genres: newGenres
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const existingBookByCurrentUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );
  // const existingBookByCurrentUser = await Book.findOne({
  //   _id: bookId,
  //   publisher: res.locals.user.id
  // });
  if (!existingBookByCurrentUser) {
    return next(new AppError(`Existing book cannot be found.`, 401));
  }
  // delete existing Books by user. issues, issues assets ect will be deleted as well because of cascading in PG
  await new QueryPG(pool).delete('books', 'id = $1 AND publisher_id = $2', [
    bookId,
    res.locals.user.id
  ]);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const { title, genres, description, urlSlug, status, removed } = req.body;

  const existingBookByCurrentUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!existingBookByCurrentUser) {
    return next(
      new AppError(
        `Existing book cannot be found. Book Could not be updated.`,
        401
      )
    );
  }

  // update book values
  const updatedBook = await new QueryPG(pool).update(
    'books',
    'title = ($1), description = ($2), url_slug = ($3), status = ($4), removed = ($5)',
    'id = ($6) AND publisher_id = ($7)',
    [title, description, urlSlug, status, removed, bookId, res.locals.user.id]
  );

  // delete existing genres
  await new QueryPG(pool).delete('genres', 'book_id = ($1)', [bookId]);

  // add new genres
  const newGenres = await addGenres(genres, bookId);

  res.status(200).json({
    status: 'success',
    updatedBook,
    updatedGenres: newGenres
  });
});

exports.updateBookCoverPhoto = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const bookCoverPhoto = req.file.location;

  // update cover photo of book
  const updatedBook = await new QueryPG(pool).update(
    'books',
    'cover_photo = ($1)',
    'id = ($2) AND publisher_id = ($3)',
    [bookCoverPhoto, bookId, res.locals.user.id]
  );
  if (!updatedBook) {
    return next(
      new AppError(
        `Existing book not found. Book photo cannot be updated.`,
        401
      )
    );
  }
  // BUG Should the previous Book Cover photo be deleted from AWS?
  res.status(200).json({
    status: 'success',
    updatedBook
  });
});

exports.updateIssueCoverPhoto = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;
  const issueCoverPhoto = req.file.location;

  // update cover photo of issue
  const updatedIssue = await new QueryPG(pool).update(
    'issues',
    'cover_photo = ($1)',
    'book_id = ($2) AND issue_number = ($3) AND publisher_id = ($4)',
    [issueCoverPhoto, bookId, issueNumber, res.locals.user.id]
  );

  if (!updatedIssue) {
    return next(
      new AppError(
        `Existing Issue not found. Issue cover photo cannot be updated.`,
        401
      )
    );
  }

  // BUG Should the previous Issue Cover photo be deleted from AWS

  res.status(200).json({
    status: 'success',
    updatedIssue
  });
});

exports.updateIssueAssets = catchAsync(async (req, res, next) => {
  // const { bookId, issueNumber } = req.params;
  // const issueCoverPhoto = req.file.location;

  // // update cover photo of issue
  // const updatedIssue = await new QueryPG(pool).update(
  //   'issues',
  //   'cover_photo = ($1)',
  //   'book_id = ($2) AND issue_number = ($3) AND publisher_id = ($4)',
  //   [issueCoverPhoto, bookId, issueNumber, res.locals.user.id]
  // );

  res.status(200).json({
    status: 'success'
    // updatedIssue
  });
});

// Get Issue
// exports.getIssue = catchAsync(async (req, res, next) => {
//   res.status(200).json({
//     status: 'success'
//   });
// });

exports.getBookAndIssueImagePrefix = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;

  // This will need to be called on create book and all other routes containing file uploads. change url for this for simplicity
  // this may be able to be used as middleware by forcibly adding data to req.body: https://stackoverflow.com/questions/41956293/express-middleware-to-modify-requests
  const randomString = () => uuid.v4().replace(/-/g, '');

  // these queries search for the book and issue paths in aws

  /* 
  If an book id has been provided, search the db for a previously 
  existing Image prefix for the provided book and use it if it exist. 
  else create a new one and pass it through to multer.
  */
  let bookImagePrefixRef;

  if (bookId) {
    const bookImagePrefix = await new QueryPG(
      pool
    ).find(
      'image_prefix_reference',
      'books WHERE id = $1 AND publisher_id = $2',
      [bookId, res.locals.user.id]
    );

    // bookImagePrefixRef = bookImagePrefix
    //   ? bookImagePrefix.image_prefix_reference
    //   : randomString();
    bookImagePrefixRef = bookImagePrefix.image_prefix_reference;
  } else {
    bookImagePrefixRef = randomString();
  }

  /* 
  If an issue number has been provided, search the db for a previously 
  existing Image prefix for the provided issue and use it if it exist. 
  else create a new one and pass it through to multer.
  */
  let issueImagePrefixRef;

  if (issueNumber) {
    const issueImagePrefix = await new QueryPG(
      pool
    ).find(
      'image_prefix_reference',
      'issues WHERE book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
      [bookId, issueNumber, res.locals.user.id]
    );

    // issueImagePrefixRef = issueImagePrefix
    //   ? issueImagePrefix.image_prefix_reference
    //   : randomString();
    issueImagePrefixRef = issueImagePrefix.image_prefix_reference;
  } else {
    issueImagePrefixRef = randomString();
  }

  // Get book and issues.
  // console.log('req.body', req.body);
  // req.body.bookImagePrefixRef = bookImagePrefixRef;
  // req.body.issueImagePrefixRef = issueImagePrefixRef;
  // req.body = {'a': 1, ...req.body};
  // console.log('req.body', req);
  // form.append('bookImagePrefixRef', 'my value');
  // return;
  // next();
  res.status(200).json({
    status: 'success',
    bookImagePrefixRef,
    issueImagePrefixRef
  });
});

exports.createIssue = catchAsync(async (req, res, next) => {
  const { issueTitle, workCredits } = req.body;
  const { bookId } = req.params;

  const AWSPrefixArray = req.files.issueCoverPhoto[0].key.split('/');

  const existingBookByCurrentUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );
  if (!existingBookByCurrentUser) {
    // BUG Should the previous Book Cover photo be deleted from AWS?
    return next(
      new AppError(`Existing book not found. Cannot create new issue.`, 401)
    );
  }

  const existingIssueCount = await new QueryPG(pool).find(
    'COUNT(*)',
    'issues WHERE book_id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  // Add one to existing issues to provide the new issue number
  const newIssueNumber = Number(existingIssueCount.count) + 1;

  // create Issue
  const newIssue = await new QueryPG(pool).insert(
    'issues(publisher_id, book_id, title, cover_photo, issue_number, image_prefix_reference)',
    '$1, $2, $3, $4, $5, $6',
    [
      res.locals.user.id,
      bookId,
      issueTitle,
      req.files.issueCoverPhoto[0].location,
      newIssueNumber,
      AWSPrefixArray[1] // issue path
    ]
  );

  // create Issue Assets
  const newIssueAssets = await addIssueAssets(
    req.files.issueAssets,
    res.locals.user.id,
    bookId,
    newIssue.id
  );

  // create Work Credits
  const newWorkCredits = await addWorkCredits(
    workCredits,
    res.locals.user.id,
    bookId,
    newIssue.id
  );

  // const existingBookByCurrentUser = await Book.findOne({
  //   _id: bookId,
  //   publisher: res.locals.user.id
  // });
  // if (!existingBookByCurrentUser) {
  //   next(
  //     new AppError(`Existing book not found. Cannot create new issue.`, 401)
  //   );
  // }
  // existingBookByCurrentUser.adjustTotalIssue('increment');
  // await existingBookByCurrentUser.save();

  // // calculates the total pages of assets provided
  // let totalPages = 0;
  // issueAssets.forEach(() => {
  //   totalPages += 1;
  // });

  // const newIssue = await Issue.create({
  //   publisher: res.locals.user.id,
  //   book: existingBookByCurrentUser.id,
  //   title: issueTitle,
  //   coverPhoto: issueCoverPhoto,
  //   issueAssets,
  //   // This makes totalIssues (from Book Model) and the current issueNumber(from Issue Model) consistent
  //   issueNumber: existingBookByCurrentUser.totalIssues,
  //   totalPages,
  //   workCredits
  // });

  res.status(201).json({
    status: 'success',
    issue: newIssue,
    issueAssets: newIssueAssets,
    workcredits: newWorkCredits
  });
});

// This deletes an existing issue
// Remember only the most recent issue should be deleted to uphold the sequential order of issues within a book
exports.deleteIssue = catchAsync(async (req, res, next) => {
  // const { urlSlug, bookId } = req.params;
  const { bookId, issueNumber } = req.params;

  const deletedIssue = await new QueryPG(pool).delete(
    'issues',
    'book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
    [bookId, issueNumber, res.locals.user.id]
  );

  if (!deletedIssue) {
    // BUG Should the previous Issue Cover photo be deleted from AWS
    return next(
      new AppError(`Existing Issue not found. Cannot delete issue.`, 401)
    );
  }

  // all issues are deleted remove book
  const remainingIssues = await new QueryPG(pool).find(
    '*',
    'issues WHERE book_id = ($1) AND publisher_id = ($2)',
    [bookId, res.locals.user.id]
  );

  let deletedBook = null;

  if (!remainingIssues) {
    deletedBook = await new QueryPG(pool).delete(
      'books',
      'id = $1 AND publisher_id = $2',
      [bookId, res.locals.user.id]
    );
  }

  res.status(204).json({
    status: 'success',
    deletedIssue,
    deletedBook
  });
});

exports.updateIssue = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;
  const { title, workCredits } = req.body;

  const issueToUpdate = await new QueryPG(pool).find(
    'id',
    'issues WHERE issue_number = ($1) AND publisher_id = ($2)',
    [issueNumber, res.locals.user.id]
  );

  const updatedIssue = await new QueryPG(pool).update(
    'issues',
    'title = ($1)',
    'book_id = ($2) AND issue_number = ($3) AND publisher_id = ($4)',
    [title, bookId, issueNumber, res.locals.user.id]
  );

  if (!updatedIssue) {
    return next(
      new AppError(`Existing Issue not found. Cannot update issue.`, 401)
    );
  }

  // delete work credits for an issues so that they can be reuploaded
  await new QueryPG(pool).delete(
    'work_credits',
    'book_id = ($1) AND issue_id = ($2) AND publisher_id = ($3)',
    [bookId, issueToUpdate.id, res.locals.user.id],
    true
  );

  // create Work Credits
  const newWorkCredits = await addWorkCredits(
    workCredits,
    res.locals.user.id,
    bookId,
    updatedIssue.id
  );

  res.status(200).json({
    status: 'success',
    updatedIssue,
    updatedWorkCredits: newWorkCredits
  });
});
