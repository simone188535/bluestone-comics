const dotenv = require('dotenv');
const mongoose = require('mongoose');
const keys = require('./config/keys');
// This enables ENV Variables
dotenv.config({ path: './config.env' });

mongoose
  .connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('DB connection successful!'));

const app = require('./app');

// start server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
