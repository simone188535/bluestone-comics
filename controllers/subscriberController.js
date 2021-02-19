const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Subscriber = require('../models/subscriberModel');

exports.checkSubscription = (onlyCheckSubscription = false) =>
  catchAsync(async (req, res, next) => {
    const currentUserIsSubscribedToPublisher = await Subscriber.findOne({
      publisher: req.body.publisher,
      subscriber: res.locals.user.id
    });

    if (!onlyCheckSubscription) {
      res.locals.subscriber = currentUserIsSubscribedToPublisher;
      return next();
    }

    res.status(200).json({
      subscribed: currentUserIsSubscribedToPublisher,
      status: 'success'
    });
  });

exports.Subscribe = catchAsync(async (req, res, next) => {
  if (res.locals.subscriber) {
    return next(
      new AppError('This user is already subscribed to this publisher.', 401)
    );
  }
  const subscribeToPublisher = await Subscriber.create({
    publisher: req.body.publisher,
    subscriber: res.locals.user.id
  });

  res.status(201).json({
    subscribed: subscribeToPublisher,
    status: 'success'
  });
});

exports.Unsubscribe = catchAsync(async (req, res, next) => {
  if (!res.locals.subscriber) {
    return next(
      new AppError('This user is not subscribed to this publisher.', 404)
    );
  }

  await Subscriber.deleteOne({
    publisher: res.locals.subscriber.publisher,
    subscriber: res.locals.subscriber.subscriber
  });

  res.status(204).json({
    status: 'success'
  });
});
