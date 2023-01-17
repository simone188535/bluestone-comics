const AppError = require('./appError');
/* The purpose of this class to do reduce the 
redundency of db queries to PostgresSQL */

class QueryPGFeature {
  // either pool or client can be passed into the parameter here
  constructor(queryInstance) {
    this.queryInstance = queryInstance;
  }

  async find(
    selectScope,
    tableInfo,
    preparedStatement = null,
    returnMultipleRows = false,
    cte = ''
  ) {
    const selectQuery = `${cte} SELECT ${selectScope} FROM ${tableInfo} `;

    // these logs can be used to see the current query and the current prepared statement
    // console.log('logMyQueryStr', selectQuery);
    // console.log('logMyParamVal', preparedStatement);

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

    // these logs can be used to see the current query and the current prepared statement
    // console.log('logMyQueryStr', insertQuery);
    // console.log('logMyParamVal', preparedStatementValues);

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

    // these logs can be used to see the current query and the current prepared statement
    // console.log('logMyQueryStr', updateQuery);
    // console.log('logMyParamVal', preparedStatementValues);

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

    // these logs can be used to see the current query and the current prepared statement
    // console.log('logMyQueryStr', deleteQuery);
    // console.log('logMyParamVal', preparedStatementValues);

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
