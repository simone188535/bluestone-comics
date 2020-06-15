const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
// const userController = require('./controllers/userController');

const app = express();

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(bodyParser.json());

//2) Routes
app.get('/', (req, res) => {
  res.status(200).json({
    working: 'yep'
  });
});
// app.route('/api/v1/users').get(userController.getAllUsers);

// app.route('/api/v1/users/signup').post(userController.signup);

// app.route('/api/v1/users/login').post(userController.login);

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
