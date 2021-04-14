const { Pool } = require('pg');
const keys = require('../config/keys');

const pool = new Pool({
  user: keys.PGUSER,
  host: keys.PGHOST,
  database: keys.PGDATABASE,
  password: keys.PGPASSWORD,
  port: keys.PGPORT
});

// pool
//   .then(() => console.log('PG DB connection successful!'))
//   .catch((err) => console.log('PG DB connection failed!', err));

// pool.on('connect', () => console.log('PG DB connection successful!'));
// pool.on('error', (err) => {
//   console.log('PG DB connection failed!', err);
//   pool.end();
// });

module.exports = pool;
