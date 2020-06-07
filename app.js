const express = require('express');
const app = express();
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');


// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.json());

//2) Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/read', () => {
console.log('testing');
});

module.exports = app;