/* The purpose of this class to do reduce the 
redundency of db queries to PostgresSQL */

class QueryPGFeature {
  constructor(queryInstance) {
    // either pool or client can be passed into the parameter here
    this.queryInstance = queryInstance;
  }

  async insert(insertInfo, values) {
    return await this.queryInstance.query(insertInfo, values);
  }
}

module.exports = QueryPGFeature;
