const { Pool } = require('pg');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const keys = require('../config/keys');

const pool = new Pool({
  connectionString: keys.PG_URI,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(keys.PG_CA_CERT, 'utf8')
  }
});

const sequelize = new Sequelize(keys.PG_URI);

module.exports = { pool, sequelize };
