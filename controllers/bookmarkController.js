const uuid = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AmazonSDKS3 = require('../utils/AmazonSDKS3');
const QueryPG = require('../utils/QueryPGFeature');
const pageOffset = require('../utils/offset');
const pool = require('../db');

exports.getBookmark = catchAsync(async (req, res) => {});

exports.getAllBookmarks = catchAsync(async (req, res) => {});

exports.createBookmark = catchAsync(async (req, res) => {});

exports.deleteBookmark = catchAsync(async (req, res) => {});
