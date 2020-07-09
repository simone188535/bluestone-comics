const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
// const userController = require('./controllers/userController');

const app = express();

// 1) Global Middlewares
// Set security and HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Restricts number of request form the same IP per hour
const limiter = rateLimit({
  max: 200,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// Important White list querystring fields that need to appear more than once in a query string
// https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065354#overview
app.use(hpp());

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(bodyParser.json());

//2) Routes
app.get('/', (req, res) => {
  res.status(200).json({
    working: 'yep'
  });
});

// .route('/api/v1/users/:id')
// .get()

app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/read', () => {
//   console.log('testing');
// });
// app.use('/api/v1/search', () => {
//   console.log('testing 2');
// });

// If route is not defined or not found.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
