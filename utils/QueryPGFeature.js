const AppError = require('./appError');
/* The purpose of this class to do reduce the 
redundency of db queries to PostgresSQL */

class QueryPGFeature {
  constructor(queryInstance) {
    // either pool or client can be passed into the parameter here
    this.queryInstance = queryInstance;
    this.currQueryStr = '';
    this.currParamValues = null;
  }

  async find(
    selectScope,
    tableInfo,
    preparedStatement = null,
    returnMultipleRows = false,
    cte = ''
  ) {
    const selectQuery = `${cte} SELECT ${selectScope} FROM ${tableInfo} `;

    this.currQueryStr = selectQuery;
    this.currParamValues = preparedStatement;

    try {
      const { rows } = await this.queryInstance.query(
        selectQuery,
        preparedStatement
      );

      const rowsReturned = returnMultipleRows ? rows : rows[0];

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }

  async insert(
    tableInfo,
    preparedStatement,
    preparedStatementValues,
    returnMultipleRows = false
  ) {
    const insertQuery = `INSERT INTO ${tableInfo} VALUES(${preparedStatement}) RETURNING *`;
    this.currQueryStr = insertQuery;
    this.currParamValues = preparedStatementValues;

    try {
      const { rows } = await this.queryInstance.query(
        insertQuery,
        preparedStatementValues
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
    preparedStatementValues,
    returnMultipleRows = false
  ) {
    const updateQuery = `UPDATE ${tableInfo} SET ${setQuery} WHERE ${whereQuery} RETURNING *`;
    this.currQueryStr = updateQuery;
    this.currParamValues = preparedStatementValues;

    try {
      const { rows } = await this.queryInstance.query(
        updateQuery,
        preparedStatementValues
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
    preparedStatementValues,
    returnMultipleRows = false
  ) {
    const deleteQuery = `DELETE FROM ${tableInfo} WHERE ${whereQuery} RETURNING *`;
    this.currQueryStr = deleteQuery;
    this.currParamValues = preparedStatementValues;

    try {
      const { rows } = await this.queryInstance.query(
        deleteQuery,
        preparedStatementValues
      );

      const rowsReturned = returnMultipleRows ? rows : rows[0];

      return rowsReturned;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }
}

module.exports = QueryPGFeature;
