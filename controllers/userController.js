const express = require('express');

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'Working user route',
  });
};
