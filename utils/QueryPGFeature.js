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

    const { rows } = await this.queryInstance.query(
      selectQuery,
      preparedStatment,
      (err, res) => {
        if (err) {
          throw new AppError(err.stack, 500);
        }
      }
    );

    // const rowsReturned = !specificRowReturned ? rows: rowsReturned[specificRowReturned];
    const rowsReturned = returnOnlyOneRow ? rows[0] : rows;

    return rowsReturned;
  }

  async insert(tableInfo, preparedStatment, values) {
    const { rows } = await this.queryInstance.query(
      `INSERT INTO ${tableInfo} VALUES(${preparedStatment}) RETURNING *`,
      values,
      (err, res) => {
        if (err) {
          throw new AppError(err.stack, 500);
        }
      }
    );

    return rows;
  }
}

module.exports = QueryPGFeature;
