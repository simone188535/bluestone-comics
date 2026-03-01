const { Pool } = require('pg');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const keys = require('../config/keys');

const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: keys.PG_URI,
  ssl: isProd
    ? { rejectUnauthorized: true } // prod relies on system trust store OR env-provided CA
    : {
        rejectUnauthorized: true,
        ca: fs.readFileSync(keys.CERTIFICATE_AUTHORITY, 'utf8')
      }
});

const sequelize = new Sequelize(keys.PG_URI);

module.exports = { pool, sequelize };
