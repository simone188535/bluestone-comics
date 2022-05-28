const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const publishRoutes = require('./routes/Publish');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const readRoutes = require('./routes/Read');
const searchRoutes = require('./routes/searchRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');

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
// serve the static files from React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/publish', publishRoutes);
app.use('/api/v1/bookmark', bookmarkRoutes);
app.use('/api/v1/read', readRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/subscribe', subscribeRoutes);

// If route is not defined or not found.
// in charge of sending the main index.html file back to the client if it didn't receive a request it recognized otherwise
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
