const express = require('express');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync((req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'Working user route',
  });
});
