class SearchFeatures {
  // constructor(query, queryString, textSearch = false) {
  constructor(query, queryString) {
    // these are the query values passed in from node AKA req.query
    this.query = query;
    this.queryString = queryString;

    // this.parameterizedIndex = 0;
    // this.parameterizedQuery = `${tableName} `;
    // this.parameterizedValues = [];
  }

  filter() {
    // status
    // q?
    // comic type: oneshot, graphic novel, comic
  }

  sort(tableColumnPrefix = '') {
    // most popular, most viewed, most likes still need to be added
    let sort;
    let ascOrDesc;

    switch (this.queryString.sort) {
      case 'oldest':
        sort = 'date_created';
        ascOrDesc = 'DESC';
        break;
      default:
        // by default, sort by newest/most recently added case
        sort = 'date_created';
        ascOrDesc = 'ASC';
    }

    this.query = `${this.query} ORDER BY ${tableColumnPrefix}${sort} ${ascOrDesc}`;

    return this;
  }

  paginate(defaultLimit) {
    const page = this.queryString.page * 1 || 1;
    const limit = (this.queryString.limit || defaultLimit) * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = `${this.query} LIMIT ${limit} OFFSET ${skip}`;

    return this;
  }

  // appendWhereAndClause() {
  //   // BUG for WHERE/AND clause add function that checks if the current query string is empty. if not add and
  //   // Only filter needs AND?????
  //   return false;
  // }

  // addParameterizedQueryAndValues() {
  //   // BUG add function that dynamically adds Parameterized query and Parameterized values
  //   return false;
  // }
}

module.exports = SearchFeatures;
