// This enables ENV Variables
require('dotenv').config({ path: './config.env' });
// const mongoose = require('mongoose');
// const keys = require('./config/keys');
const {
  pool // sequelize
} = require('./db');
// This enables ENV Variables

// console.log(process.env.NODE_ENV);
// console.log('keys', keys);

// sequelize added for migrations and seeding data
// try {
//   const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

pool
  .connect()
  .then(() => console.log('PG DB connection successful!'))
  .catch((err) => {
    console.log('PG DB connection failed!', err);
    pool.end();
  });

// mongoose
//   .connect(keys.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
//   })
//   .then(() => console.log('MongoDB connection successful!'))
//   .catch((err) => console.log('MongoDB connection failed!', err));

const app = require('./app');

// start server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
