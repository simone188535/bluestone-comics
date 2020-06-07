const express = require('express')
const app = express();
const userRoutes = require('./routes/userRoutes');
const morgan = require('morgan');

// 1) Middlewares
app.use(express.json());

app.use(morgan('dev'));

//2) Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/read', () => {
console.log('testing');
});

// 3) start server
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});