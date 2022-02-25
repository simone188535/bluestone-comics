const validator = require('validator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QueryPG = require('../utils/QueryPGFeature');
const randomUUIDString = require('../utils/randomUUIDString');
const pool = require('../db');

exports.getUser = catchAsync(async (req, res, next) => {
  const { id, username, email } = req.query;

  let findVal;
  let preparedStatementVal;

  if (id) {
    findVal = 'id';
    preparedStatementVal = id;
  } else if (username) {
    findVal = 'username';
    preparedStatementVal = username;
  } else if (email) {
    findVal = 'email';
    preparedStatementVal = email;
  } else {
    return next(
      new AppError(
        'An id, username, or email must be provided to retrieve a user.',
        406
      )
    );
  }

  // const user = await User.findOne(queryObject);
  const user = await new QueryPG(pool).find(
    'id, email, username, user_photo, background_user_photo, role, bio, date_created',
    `users WHERE ${findVal} = ($1)`,
    [preparedStatementVal]
  );

  if (!user) {
    return next(new AppError('This user does not exist.', 404));
  }

  res.status(200).json({
    status: 'success',
    user
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // const users = await User.find();
  const users = await new QueryPG(pool).find('*', 'users', null, true);

  res.status(200).json({
    status: 'success',
    data: users
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    passwordConfirm,
    bio
  } = req.body;

  // 1) THIS ROUTE IS NOT FOR PASSWORD UPDATES. PLEASE USE /update-password
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password',
        400
      )
    );
  }

  // Check if email is valid before updating
  if (!validator.isEmail(email)) {
    return next(new AppError('This is not a valid email!', 406));
  }

  const updatedUser = await new QueryPG(pool).update(
    'users',
    `first_name = ($1), last_name = ($2), username = ($3), email = ($4), bio = ($5)`,
    'id = ($6)',
    [firstName, lastName, username, email, bio, res.locals.user.id]
  );

  // remove encrypted passwords from results
  updatedUser.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // User is never really deleted. Just deactivated as a safety precaution

  // Change user account activity to false, this account is no longer active
  const currentUser = await new QueryPG(pool).find(
    '*',
    'users WHERE id = ($1)',
    [res.locals.user.id]
  );

  if (!currentUser) {
    return next(
      new AppError(
        'This user could not be found. Account cannot be deleted',
        404
      )
    );
  }

  if (currentUser.active === true) {
    await new QueryPG(pool).update(
      'users',
      'active = ($1), last_updated = ($2)',
      'id = ($3)',
      [false, new Date(), res.locals.user.id]
    );
  }

  res.locals.user = undefined;

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: res.locals.user
  });
});

exports.updateProfileImg = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: res.locals.user
  });
});

exports.updateBackgroundProfileImg = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success'
  });
});

exports.getProfilePicImagePrefix = catchAsync(async (req, res, next) => {
  let userProfilePhotoPrefix;
  let userProfileBackgroundPhotoPrefix;
  const userId = res.locals.user.id;

  // find the current user
  const userProfilePics = await new QueryPG(pool).find(
    'user_photo, background_user_photo',
    'users WHERE id = ($1)',
    [userId]
  );

  /* 
  if the default image is used, create a new path for the 'soon to be created' image, else
  use the existing name
  */
  if (userProfilePics.user_photo.includes('profile-pic.jpeg')) {
    userProfilePhotoPrefix = randomUUIDString();
  } else {
    userProfilePhotoPrefix = userProfilePics.user_photo;
  }

  if (
    userProfilePics.background_user_photo.includes('plain-white-background.jpg')
  ) {
    userProfileBackgroundPhotoPrefix = randomUUIDString();
  } else {
    userProfileBackgroundPhotoPrefix = userProfilePics.background_user_photo;
  }

  res.status(200).json({
    status: 'success',
    userProfilePhotoPrefix,
    userProfileBackgroundPhotoPrefix
  });
});

exports.updateProfileImg = catchAsync(async (req, res, next) => {
  const userId = res.locals.user.id;
  // const { bookId, issueNumber } = req.params;
  // const issueCoverPhoto = req.file.location;

  // const issueToUpdate = await new QueryPG(pool).find(
  //   'cover_photo',
  //   'issues WHERE book_id = ($1) AND issue_number = ($2) AND publisher_id = ($3)',
  //   [bookId, issueNumber, res.locals.user.id]
  // );

  // if (!issueToUpdate) {
  //   return next(
  //     new AppError(
  //       `Existing issue cannot be found. Issue could not be updated.`,
  //       404
  //     )
  //   );
  // }

  // // update cover photo of issue
  // const updatedIssue = await new QueryPG(pool).update(
  //   'issues',
  //   'cover_photo = ($1), last_updated = ($2)',
  //   'book_id = ($3) AND issue_number = ($4) AND publisher_id = ($5)',
  //   [issueCoverPhoto, new Date(), bookId, issueNumber, res.locals.user.id]
  // );

  // // Delete previous Issue Cover photo in AWS
  // await deleteSingleS3Object(issueToUpdate.cover_photo);

  // res.status(200).json({
  //   status: 'success',
  //   updatedIssue
  // });
});
