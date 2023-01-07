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
    preparedStatment = null,
    returnMultipleRows = false,
    cte = ''
  ) {
    const selectQuery = `${cte} SELECT ${selectScope} FROM ${tableInfo} `;

    try {
      const { rows } = await this.queryInstance.query(
        selectQuery,
        preparedStatment
      );

      const rowsReturned = returnMultipleRows ? rows : rows[0];

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  async insert(
    tableInfo,
    preparedStatment,
    preparedStatmentValues,
    returnMultipleRows = false
  ) {
    try {
      const { rows } = await this.queryInstance.query(
        `INSERT INTO ${tableInfo} VALUES(${preparedStatment}) RETURNING *`,
        preparedStatmentValues
      );

      const rowsReturned = returnMultipleRows ? rows : rows[0];

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  async update(
    tableInfo,
    setQuery,
    whereQuery,
    preparedStatmentValues,
    returnMultipleRows = false
  ) {
    try {
      const { rows } = await this.queryInstance.query(
        `UPDATE ${tableInfo} SET ${setQuery} WHERE ${whereQuery} RETURNING *`,
        preparedStatmentValues
      );

      const rowsReturned = returnMultipleRows ? rows : rows[0];

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  async delete(
    tableInfo,
    whereQuery,
    preparedStatmentValues,
    returnMultipleRows = false
  ) {
    try {
      const { rows } = await this.queryInstance.query(
        `DELETE FROM ${tableInfo} WHERE ${whereQuery} RETURNING *`,
        preparedStatmentValues
      );

      const rowsReturned = returnMultipleRows ? rows : rows[0];

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }
}

module.exports = QueryPGFeature;
