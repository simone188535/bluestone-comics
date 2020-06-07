const app = require('./app');

// start server
const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

