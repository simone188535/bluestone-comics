/* The purpose of this class to do reduce the 
redundency of db queries to PostgresSQL */

class QueryPGFeature {
  constructor(queryInstance) {
    // either pool or client can be passed into the parameter here
    this.queryInstance = queryInstance;
  }

  insert(tableInfo, preparedStatment, values) {
    return this.queryInstance.query(
      `INSERT INTO ${tableInfo} VALUES(${preparedStatment}) RETURNING *`,
      values
    );
  }
}

module.exports = QueryPGFeature;
