/* The purpose of this class to do reduce the 
redundency of db queries to PostgresSQL */

class QueryPGFeature {
  constructor(queryInstance) {
    // either pool or client can be passed into the parameter here
    this.queryInstance = queryInstance;
  }

  async insert(tableInfo, preparedStatment, values) {
    const { rows } = await this.queryInstance.query(
      `INSERT INTO ${tableInfo} VALUES(${preparedStatment}) RETURNING *`,
      values
    );

    return rows;
  }
}

module.exports = QueryPGFeature;
