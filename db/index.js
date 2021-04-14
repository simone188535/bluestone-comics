const { Pool } = require('pg');
const keys = require('../config/keys');

const pool = new Pool({
  user: keys.PGUSER,
  host: keys.PGHOST,
  database: keys.PGDATABASE,
  password: keys.PGPASSWORD,
  port: keys.PGPORT
});

module.exports = pool;
