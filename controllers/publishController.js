const uuid = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const keys = require('../config/keys');
const AmazonSDKS3 = require('../utils/AmazonSDKS3');
// const filterObj = require('../utils/filterObj');
const QueryPG = require('../utils/QueryPGFeature');
const pageOffset = require('../utils/offset');
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
          const addedWorkCredit = await new QueryPG(pool).insert(
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

const deleteAllIssueAssets = async (issueAssets) => {
  const issueAssetsToDelete = issueAssets.map((issueAsset) => {
    return { Key: AmazonSDKS3.getS3FilePath(issueAsset.photo_url) };
  });

  // delete issue assets
  await AmazonSDKS3.deleteMultipleS3Objects(issueAssetsToDelete);
};

/*
  This method inserts the uploaded Issue Assets (By Multer/S3) into the issue_assets table
*/
const addIssueAssets = async (
  issueAssets,
  publisherId,
  bookId,
  issueId,
  pageNumArr = null
) => {
  const newIssueAssets = [];

  await Promise.all(
    issueAssets?.map(async (issueAsset, index) => {
      const pageNumber = pageNumArr ? pageNumArr[index] : index + 1;
      const addedIssueAsset = await new QueryPG(pool).insert(
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
      const addedGenre = await new QueryPG(pool).insert(
        'genres(book_id, genre)',
        '$1, $2',
        [bookId, genre.toLowerCase()]
      );

      newGenres.push(addedGenre);
    })
  );
  return newGenres;
};

exports.getBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const bookByUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  const genres = await new QueryPG(pool).find(
    'id, genre',
    'genres WHERE book_id = $1',
    [bookId],
    true
  );

  if (!bookByUser) {
    return next(
      new AppError(`Existing book by the current user cannot be found.`, 404)
    );
  }
  // Get the book cover photo file in AWS associated with this book
  const bookCoverPhotoFile = await AmazonSDKS3.getSingleS3Object(
    AmazonSDKS3.getS3FilePath(bookByUser.cover_photo)
  );

  // Get book and issues.
  res.status(200).json({
    status: 'success',
    book: bookByUser,
    genres,
    bookCoverPhotoFile
  });
});

exports.getIssues = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const { page } = req.query;

  const offset = pageOffset(page, 20);

  const issuesOfBookByUser = await new QueryPG(pool).find(
    '*',
    'issues WHERE book_id = ($1) AND publisher_id = ($2) ORDER BY issue_number ASC LIMIT 20 OFFSET ($3)',
    [bookId, res.locals.user.id, offset],
    true
  );

  // Get book and issues.
  res.status(200).json({
    status: 'success',
    issues: issuesOfBookByUser
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
    issueDescription,
    workCredits,
    contentRating
  } = req.body;

  // grab AWS file path (where the file is saved in aws) and save it to the db (each of these files should share path/location in aws)
  const AWSPrefixArray = req.files.issueCoverPhoto[0].key.split('/');

  // create new Book
  const newBook = await new QueryPG(pool).insert(
    'books(publisher_id, title, url_slug, cover_photo, description, image_prefix_reference, content_rating)',
    '$1, $2, $3, $4, $5, $6, $7',
    [
      res.locals.user.id,
      bookTitle,
      urlSlug,
      req.files.bookCoverPhoto[0].location,
      bookDescription,
      AWSPrefixArray[1], // book path
      contentRating
    ]
  );

  // create Issue
  const newIssue = await new QueryPG(pool).insert(
    'issues(publisher_id, book_id, title, cover_photo, description, image_prefix_reference)',
    '$1, $2, $3, $4, $5, $6',
    [
      res.locals.user.id,
      newBook.id,
      issueTitle,
      req.files.issueCoverPhoto[0].location,
      issueDescription,
      AWSPrefixArray[2] // issue path
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

  // Change user role to creator if it isn't already
  const currentUser = await new QueryPG(pool).find(
    '*',
    'users WHERE id = ($1)',
    [res.locals.user.id]
  );

  if (currentUser.role === 'user') {
    const updatedUser = await new QueryPG(pool).update(
      'users',
      'role = ($1), last_updated = ($2)',
      'id = ($3)',
      ['creator', new Date(), res.locals.user.id]
    );

    res.locals.user = updatedUser;
  }

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
    'id, cover_photo',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!existingBookByCurrentUser) {
    return next(new AppError(`Existing book cannot be found.`, 404));
  }

  const existingIssueCount = await new QueryPG(pool).find(
    'COUNT(*)',
    'issues WHERE book_id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  // recursively delete Issue Assets and Issue Covers from AWS
  const DeleteAllIssuesAndIssueCovers = async (remainingIssues) => {
    const issue = await new QueryPG(pool).find(
      'id, cover_photo',
      'issues WHERE book_id = ($1) AND publisher_id = ($2) AND issue_number = ($3)',
      [bookId, res.locals.user.id, remainingIssues]
    );

    const issueAssets = await new QueryPG(pool).find(
      'photo_url',
      'issue_assets WHERE book_id = ($1) AND publisher_id = ($2) AND issue_id = ($3)',
      [bookId, res.locals.user.id, issue.id],
      true
    );

    // delete issue assets
    await deleteAllIssueAssets(issueAssets);

    // delete issue cover photo
    await AmazonSDKS3.deleteSingleS3Object(
      AmazonSDKS3.getS3FilePath(issue.cover_photo)
    );

    remainingIssues -= 1;

    if (remainingIssues > 0) {
      await DeleteAllIssuesAndIssueCovers(remainingIssues);
    }
  };

  await DeleteAllIssuesAndIssueCovers(Number(existingIssueCount.count));

  // delete book cover photo
  await AmazonSDKS3.deleteSingleS3Object(
    AmazonSDKS3.getS3FilePath(existingBookByCurrentUser.cover_photo)
  );

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

  const {
    title,
    genres,
    description,
    urlSlug,
    status,
    removed,
    contentRating
  } = req.body;

  const existingBookByCurrentUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!existingBookByCurrentUser) {
    return next(
      new AppError(
        `Existing book cannot be found. Book Could not be updated.`,
        404
      )
    );
  }

  // update book values
  const updatedBook = await new QueryPG(pool).update(
    'books',
    'title = ($1), description = ($2), url_slug = ($3), status = ($4), removed = ($5), last_updated = ($6), content_rating = ($7)',
    'id = ($8) AND publisher_id = ($9)',
    [
      title,
      description,
      urlSlug,
      status,
      removed,
      new Date(),
      contentRating,
      bookId,
      res.locals.user.id
    ]
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
  const existingFile = req.file;

  if (!existingFile) return next(new AppError(`No File provided.`, 204));
  const { fieldname, originalname, mimetype, buffer } = existingFile;

  const bookCoverPhotoByCurrentUser = await new QueryPG(pool).find(
    'cover_photo',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!bookCoverPhotoByCurrentUser) {
    return next(
      new AppError(
        `Existing book cannot be found by this user. Book could not be updated.`,
        404
      )
    );
  }

  const updatedImg = await AmazonSDKS3.uploadS3Object(
    AmazonSDKS3.getS3FilePath(bookCoverPhotoByCurrentUser.cover_photo),
    {
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      Metadata: { name: originalname, fieldName: fieldname }
    }
  );

  // update cover photo of book
  const updatedBook = await new QueryPG(pool).update(
    'books',
    'cover_photo = ($1), last_updated = ($2)',
    'id = ($3) AND publisher_id = ($4)',
    [updatedImg.Location, new Date(), bookId, res.locals.user.id]
  );
  if (!updatedBook) {
    return next(
      new AppError(
        `Existing book not found. Book photo cannot be updated.`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    updatedBook
  });
});

exports.updateIssueCoverPhoto = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;
  const existingFile = req.file;

  if (!existingFile) return next(new AppError(`No File provided.`, 204));
  const { fieldname, originalname, mimetype, buffer } = existingFile;

  const issueToUpdate = await new QueryPG(pool).find(
    'cover_photo',
    'issues WHERE book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
    [bookId, issueNumber, res.locals.user.id]
  );

  if (!issueToUpdate) {
    return next(
      new AppError(
        `Existing issue cannot be found. Issue could not be updated.`,
        404
      )
    );
  }

  const updatedImg = await AmazonSDKS3.uploadS3Object(
    AmazonSDKS3.getS3FilePath(issueToUpdate.cover_photo),
    {
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      Metadata: { name: originalname, fieldName: fieldname }
    }
  );

  // update cover photo of issue
  const updatedIssue = await new QueryPG(pool).update(
    'issues',
    'cover_photo = ($1), last_updated = ($2)',
    'book_id = ($3) AND issue_number = ($4) AND publisher_id = ($5)',
    [updatedImg.Location, new Date(), bookId, issueNumber, res.locals.user.id]
  );

  res.status(200).json({
    status: 'success',
    updatedIssue
  });
});

exports.updateIssueAssets = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;
  const {
    // prevIssueAssets is an array of previously added issue assets that are already in the DB, it does not include the new files uploaded to AWS S3
    prevIssueAssets,
    newIssueAssetsPageNums,
    prevIssueAssetsUpdatedPageNums,
    issueAssetsToBeRemoved
  } = req.body;
  // array of new issue assets uploaded to AWS
  const newIssueAssets = req.files;
  // array of the new page numbers of the for the new issue assets uploaded to AWS
  const newIssueAssetsPageNumsParsed = JSON.parse(newIssueAssetsPageNums);

  // array of obj for prev/existing issue assets
  const prevIssueAssetsParsed = JSON.parse(prevIssueAssets);
  // array of the new page numbers of the previously added issue assets (that are already in the DB)
  const prevIssueAssetsUpdatedPageNumsParsed = JSON.parse(
    prevIssueAssetsUpdatedPageNums
  );

  const issueAssetsToBeRemovedParsed = JSON.parse(issueAssetsToBeRemoved);

  // get book and issue id
  const getIssue = await new QueryPG(pool).find(
    'id',
    'issues WHERE book_id = ($1) AND publisher_id = ($2) AND issue_number = ($3)',
    [bookId, res.locals.user.id, issueNumber]
  );

  // console.log('req.files', req.files);
  // save each new image to db along with their new page numbers (newIssueAssetsPageNumsParsed)
  const newIssueAssetsArr = await addIssueAssets(
    newIssueAssets,
    res.locals.user.id,
    bookId,
    getIssue.id,
    newIssueAssetsPageNumsParsed
  );

  // update the existing File (prevIssueAssetsUpdatedPageNumsParsed) with their new page orders if needed (prevIssueAssets)
  const updatedIssueAssets = [];
  // console.log('prevIssueAssetsParsed', prevIssueAssetsParsed);
  await Promise.all(
    prevIssueAssetsParsed?.map(async (issueAsset, index) => {
      // if the current page number is different than the new page number, update it
      if (
        prevIssueAssetsUpdatedPageNumsParsed[index] !== issueAsset.page_number
      ) {
        const updatedIssueAsset = await new QueryPG(pool).update(
          'issue_assets',
          'page_number = ($1), last_updated = ($2)',
          'book_id = ($3) AND issue_id = ($4) AND publisher_id = ($5) AND photo_url = ($6)',
          [
            prevIssueAssetsUpdatedPageNumsParsed[index],
            new Date(),
            bookId,
            getIssue.id,
            res.locals.user.id,
            issueAsset.photo_url
          ]
        );

        updatedIssueAssets.push(updatedIssueAsset);
      }
    })
  );

  // delete the removed pages
  const deletedIssueAssets = [];
  // console.log('issueAssetsToBeRemovedParsed', issueAssetsToBeRemovedParsed);
  await Promise.all(
    issueAssetsToBeRemovedParsed?.map(async (issueAssetToDelete) => {
      // delete issue asset in AWS
      await AmazonSDKS3.deleteSingleS3Object(
        AmazonSDKS3.getS3FilePath(issueAssetToDelete.photo_url)
      );

      const deletedIssueAsset = await new QueryPG(pool).delete(
        'issue_assets',
        'book_id = ($1) AND issue_id = ($2) AND publisher_id = ($3) AND photo_url = ($4)',
        [bookId, getIssue.id, res.locals.user.id, issueAssetToDelete.photo_url]
      );

      deletedIssueAssets.push(deletedIssueAsset);
    })
  );

  res.status(201).json({
    status: 'success',
    newIssueAssets: newIssueAssetsArr,
    updatedIssueAssets,
    deletedIssueAssets
  });
});

exports.getIssue = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;

  const issueOfBookByUser = await new QueryPG(pool).find(
    '*',
    'issues WHERE book_id = ($1) AND publisher_id = ($2) AND issue_number = ($3)',
    [bookId, res.locals.user.id, issueNumber]
  );

  if (!issueOfBookByUser) {
    return next(new AppError(`Existing Issue not found. `, 404));
  }
  const issueAssets = await new QueryPG(pool).find(
    '*',
    'issue_assets WHERE book_id = ($1) AND publisher_id = ($2) AND issue_id = ($3) ORDER BY page_number ASC',
    [bookId, res.locals.user.id, issueOfBookByUser.id],
    true
  );

  const issueCoverPhotoFile = await AmazonSDKS3.getSingleS3Object(
    AmazonSDKS3.getS3FilePath(issueOfBookByUser.cover_photo)
  );

  // Get all AWS Objects (Files) for issue assets
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
    issueCoverPhotoFile,
    issueAssets
    // issueAssetFiles
  });
});

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
    const bookImagePrefix = await new QueryPG(pool).find(
      'image_prefix_reference',
      'books WHERE id = $1 AND publisher_id = $2',
      [bookId, res.locals.user.id]
    );

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
    const issueImagePrefix = await new QueryPG(pool).find(
      'image_prefix_reference',
      'issues WHERE book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
      [bookId, issueNumber, res.locals.user.id]
    );

    issueImagePrefixRef = issueImagePrefix.image_prefix_reference;
  } else {
    issueImagePrefixRef = randomString();
  }

  res.status(200).json({
    status: 'success',
    bookImagePrefixRef,
    issueImagePrefixRef
  });
});

exports.createIssue = catchAsync(async (req, res, next) => {
  const { issueTitle, workCredits, issueDescription } = req.body;
  const { bookId } = req.params;

  const AWSPrefixArray = req.files.issueCoverPhoto[0].key.split('/');

  const existingBookByCurrentUser = await new QueryPG(pool).find(
    '*',
    'books WHERE id = $1 AND publisher_id = $2',
    [bookId, res.locals.user.id]
  );

  if (!existingBookByCurrentUser) {
    // deleted Issue Cover photo and Issue Assets from AWS because the issue cannot be added
    await AmazonSDKS3.deleteSingleS3Object(
      AmazonSDKS3.getS3FilePath(req.files.issueCoverPhoto[0].location)
    );

    await Promise.all(
      req.files.issueAssets.map(async (issueAsset) => {
        await AmazonSDKS3.deleteSingleS3Object(
          AmazonSDKS3.getS3FilePath(issueAsset.location)
        );
      })
    );
    return next(
      new AppError(`Existing book not found. Cannot create new issue.`, 404)
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
    'issues(publisher_id, book_id, title, cover_photo, issue_number, description, image_prefix_reference)',
    '$1, $2, $3, $4, $5, $6, $7',
    [
      res.locals.user.id,
      bookId,
      issueTitle,
      req.files.issueCoverPhoto[0].location,
      newIssueNumber,
      issueDescription,
      AWSPrefixArray[2] // issue path
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
  const { bookId, issueNumber } = req.params;

  // get issue id
  const issueId = await new QueryPG(pool).find(
    'id',
    'issues WHERE book_id = ($1) AND issue_number = ($2)',
    [bookId, issueNumber]
  );

  // find Issue assets
  const issueAssetsToBeDeleted = await new QueryPG(pool).find(
    '*',
    'issue_assets WHERE book_id = ($1) AND publisher_id = ($2) AND issue_id = ($3)',
    [bookId, res.locals.user.id, issueId.id],
    true
  );

  // delete issue assets in AWS
  await deleteAllIssueAssets(issueAssetsToBeDeleted);

  // delete issue, issue assets will be deleted on cascade
  const deletedIssue = await new QueryPG(pool).delete(
    'issues',
    'book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
    [bookId, issueNumber, res.locals.user.id]
  );

  if (!deletedIssue) {
    return next(
      new AppError(`Existing Issue not found. Cannot delete issue.`, 404)
    );
  }

  // deleted Issue Cover photo from AWS
  await AmazonSDKS3.deleteSingleS3Object(
    AmazonSDKS3.getS3FilePath(deletedIssue.cover_photo)
  );

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
    deletedBook,
    deletedIssueAssets: issueAssetsToBeDeleted
  });
});

exports.updateIssue = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;
  const { title, workCredits, issueDescription } = req.body;

  const issueToUpdate = await new QueryPG(pool).find(
    'id',
    'issues WHERE book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
    [bookId, issueNumber, res.locals.user.id]
  );

  const updatedIssue = await new QueryPG(pool).update(
    'issues',
    'title = ($1), description = ($2), last_updated = ($3)',
    'book_id = ($4) AND issue_number = ($5) AND publisher_id = ($6)',
    [
      title,
      issueDescription,
      new Date(),
      bookId,
      issueNumber,
      res.locals.user.id
    ]
  );

  if (!updatedIssue) {
    return next(
      new AppError(`Existing Issue not found. Cannot update issue.`, 404)
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

exports.prevExistingIssueWorkCredits = catchAsync(async (req, res, next) => {
  const { bookId, issueNumber } = req.params;

  const formattedWorkCredits = [];

  const { id: issueId } = await new QueryPG(pool).find(
    'id',
    'issues WHERE book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
    [bookId, issueNumber, res.locals.user.id]
  );

  const workCredits = await new QueryPG(pool).find(
    'users.username, work_credits.creator_id, work_credits.creator_credit',
    'work_credits INNER JOIN users ON users.id = work_credits.creator_id WHERE book_id = ($1) AND issue_id = ($2) AND publisher_id = ($3)',
    [bookId, issueId, res.locals.user.id],
    true
  );

  // check if the user Id (aka user) is already present in the formattedWorkCredits array of objects
  const isUserInWorkCredits = (objId) =>
    formattedWorkCredits.find(({ user }) => user === objId);

  // if the user is already added to formattedWorkCredits, simply push the credits array, else add a new object to formattedWorkCredits
  workCredits.forEach(
    ({ username, creator_id: creatorId, creator_credit: credit }) => {
      const foundUserId = isUserInWorkCredits(creatorId);

      if (foundUserId) {
        foundUserId.credits.push(credit);
      } else {
        formattedWorkCredits.push({
          user: creatorId,
          username: username,
          credits: [credit]
        });
      }
    }
  );

  res.status(200).json({
    status: 'success',
    // workCredits,
    workCredits: formattedWorkCredits
  });
});
