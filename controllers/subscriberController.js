const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const Subscriber = require('../models/subscriberModel');
const QueryPG = require('../utils/QueryPGFeature');
const pageOffset = require('../utils/offset');
const pool = require('../db');

exports.checkSubscription = (onlyCheckSubscription = false) =>
  catchAsync(async (req, res, next) => {
    const { publisherId } = req.params;

    const currentUserSubscribedToPublisher = await new QueryPG(pool).find(
      'publisher_id, subscriber_id',
      'subscribers WHERE publisher_id = ($1) AND subscriber_id = ($2)',
      [publisherId, res.locals.user.id]
    );

    if (onlyCheckSubscription) {
      if (!currentUserSubscribedToPublisher) {
        return next(
          new AppError(`User is not subscribed to this publisher.`, 404)
        );
      }
    } else {
      const isSubscribed = !!currentUserSubscribedToPublisher;
      res.locals.subscribed = isSubscribed;
      return next();
    }

    res.status(200).json({
      subscribed: currentUserSubscribedToPublisher,
      status: 'success'
    });
  });

exports.subscribe = catchAsync(async (req, res, next) => {
  const { publisherId } = req.params;

  if (res.locals.subscribed) {
    return next(
      new AppError('This user is already subscribed to this publisher.', 401)
    );
  }
  // prevent user from subscribing to themselves
  if (Number(publisherId) === Number(res.locals.user.id)) {
    return next(new AppError('A user cannot subscribe to themselves.', 400));
  }

  const subscribeToPublisher = await new QueryPG(pool).insert(
    'subscribers (publisher_id, subscriber_id)',
    '$1, $2',
    [publisherId, res.locals.user.id]
  );

  res.status(201).json({
    subscribed: subscribeToPublisher,
    status: 'success'
  });
});

exports.unsubscribe = catchAsync(async (req, res, next) => {
  const { publisherId } = req.params;
  if (!res.locals.subscribed) {
    return next(
      new AppError('This user is not subscribed to this publisher.', 404)
    );
  }

  await new QueryPG(pool).delete(
    'subscribers',
    'publisher_id = ($1) AND subscriber_id = ($2) ',
    [publisherId, res.locals.user.id]
  );

  res.status(204).json({
    status: 'success'
  });
});

// all subscribers to a specific user
exports.getAllSubscribers = catchAsync(async (req, res, next) => {
  const { page } = req.query;
  const { publisherId } = req.params;

  const offset = pageOffset(page);

  const allSubscribers = await new QueryPG(pool).find(
    'subscriber_id, username, user_photo',
    'subscribers INNER JOIN users ON (users.id = subscribers.publisher_id) WHERE publisher_id = ($1) LIMIT 20 OFFSET ($2)',
    [publisherId, offset],
    true
  );

  // There are no subscriber to this user yet
  if (!allSubscribers) {
    return next(new AppError('This user has no subscribers yet.', 404));
  }

  res.status(200).json({
    status: 'success',
    subscribers: allSubscribers
  });
});

// All publishers this user is subscribed to
exports.getAllSubscribedTo = catchAsync(async (req, res, next) => {
  const { page } = req.query;
  const { subscriberId } = req.params;

  const offset = pageOffset(page);

  /* 
  This query works by first searching for all of the users the current user is subscribed to in the subscribers table (the action occurs in the 3rd subquery).
  It then takes the list of users (that the current user is subscribed to) and displays their publisher_id, username, user_photo and their subscriber count. 
  ex: https://stackoverflow.com/questions/46988538/sql-use-result-from-one-query-for-another-query
  */
  // (SELECT COUNT(all_users_subbed_to.subscriber_id) FROM subscribers s2 WHERE s2.subscriber_id = all_users_subbed_to.publisher_id) AS subscribers_sub_count
  // GROUP BY s.subscriber_id
  const allSubscribedTo = await new QueryPG(pool).find(
    'all_users_subbed_to.*',
    '(SELECT publisher_id, subscriber_id, u.username AS username, u.user_photo AS user_photo FROM subscribers s INNER JOIN users u ON (u.id = s.subscriber_id) INNER JOIN users u2 ON (u2.id = s.publisher_id) WHERE subscriber_id = ($1) LIMIT 20 OFFSET ($2)) AS all_users_subbed_to',
    [subscriberId, offset],
    true
  );

  // const allSubscribedTo = await new QueryPG(pool).find(
  //   'publisher_id, username, user_photo, (SELECT COUNT(*) FROM subscribers WHERE subscribers.subscriber_id = all_users_subbed_to.subscriber_id ) AS subscribers_sub_count, (SELECT COUNT(all_users_subbed_to.*) AS current_user_sub_count)',
  //   '(SELECT * from subscribers INNER JOIN users ON (users.id = subscribers.subscriber_id) WHERE subscriber_id = ($1) LIMIT 20 OFFSET ($2)) AS all_users_subbed_to',
  //   [subscriberId, offset],
  //   true
  // );
  // ORIGINAL
  // const allSubscribedTo = await new QueryPG(pool).find(
  //   'publisher_id, username, user_photo',
  //   'subscribers INNER JOIN users ON (users.id = subscribers.subscriber_id) WHERE subscriber_id = ($1) LIMIT 20 OFFSET ($2)',
  //   [subscriberId, offset],
  //   true
  // );
  // const allSubscribedTo = await new QueryPG(pool).find(
  //   '*',
  //   'subscribers WHERE subscribers.publisher_id = 80',
  //   [],
  //   true
  // );

  // This user hasn't subscribed to anyone yet
  if (!allSubscribedTo) {
    return next(
      new AppError('This user has not subscribed to anyone yet.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    subscribedTo: allSubscribedTo
  });
});
