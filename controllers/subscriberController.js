const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Subscriber = require('../models/subscriberModel');

exports.Subscribe = catchAsync(async (req, res) => {
  // const usernameQuery = req.query.q;

  // const users = await User.find({
  //   username: { $regex: usernameQuery, $options: 'i' }
  // });

  // Send Response
  res.status(200).json({
    // results: users.length,
    // users,
    status: 'success'
  });
});
