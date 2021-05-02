const AppError = require('./appError');
/* The purpose of this class to do reduce the 
redundency of db queries to PostgresSQL */

class QueryPGFeature {
  constructor(queryInstance) {
    // either pool or client can be passed into the parameter here
    this.queryInstance = queryInstance;
  }

  async find(
    selectScope,
    tableInfo,
    additionalSelectQuery = null,
    preparedStatment = null,
    returnOnlyOneRow = false
  ) {
    let selectQuery = `SELECT ${selectScope} FROM ${tableInfo} `;

    if (additionalSelectQuery) {
      selectQuery += additionalSelectQuery;
    }
    try {
      const { rows } = await this.queryInstance.query(
        selectQuery,
        preparedStatment
      );

      const rowsReturned = returnOnlyOneRow ? rows[0] : rows;

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  async insert(tableInfo, preparedStatment, values) {
    try {
      const { rows } = await this.queryInstance.query(
        `INSERT INTO ${tableInfo} VALUES(${preparedStatment}) RETURNING *`,
        values
      );

      return rows;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }
}

module.exports = QueryPGFeature;
