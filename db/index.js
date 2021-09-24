const { Pool } = require('pg');
const keys = require('../config/keys');

const pool = new Pool({
  connectionString: keys.PG_URI
});

module.exports = pool;
