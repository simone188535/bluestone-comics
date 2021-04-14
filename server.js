const dotenv = require('dotenv');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const Pool = require('./db');
// This enables ENV Variables
dotenv.config({ path: './config.env' });

Pool.connect()
  .then(() => console.log('PG DB connection successful!'))
  .catch((err) => {
    console.log('PG DB connection failed!', err);
    Pool.end();
  });

mongoose
  .connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connection successful!'))
  .catch((err) => console.log('MongoDB connection failed!', err));

const app = require('./app');

// start server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
