const dotenv = require('dotenv');
// This enables ENV Variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// start server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});