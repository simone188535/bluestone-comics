const dotenv = require('dotenv');
// This enables ENV Variables
dotenv.config({ path: './config.env' });

const app = require('./app');

const keys = require('./config/keys');

// start server
const port = process.env.PORT || keys.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});