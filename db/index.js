const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const keys = require('../config/keys');

const pool = new Pool({
  connectionString: keys.PG_URI
});

const sequelize = new Sequelize(keys.PG_URI);

module.exports = { pool, sequelize };
