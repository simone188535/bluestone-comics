class SearchFeatures {
  // constructor(query, queryString, textSearch = false) {
  constructor(query, queryString, parameterizedValues = []) {
    // these are the query values passed in from node AKA req.query
    this.query = query;
    this.queryString = queryString;
    this.parameterizedValues = parameterizedValues;

    this.parameterizedIndex = 0;
    // this.parameterizedQuery = `${tableName} `;
    // this.parameterizedValues = [];
  }

  filter() {
    // count how many $ are in the given query expression so that the correct Parameterized query value
    // can be added if needed ie ($3) or ($1)
    // let parameterizedIndex = this.query.match(/\$/g).length;
    // status
    // q?
    // comic type: oneshot, graphic novel, comic

    let whereClause = '';
    // if a text search/q is present
    if (this.queryString.q) {
      whereClause += `title ILIKE ($${this.parameterizedIndexInc()}) OR  description ILIKE ($${this.parameterizedIndexInc()}) `;
      // append where clause values for title and description
      this.parameterizedValues.push(
        `${this.queryString.q}%`,
        `${this.queryString.q}%`
      );
    }

    if (this.queryString.status) {
      // if the where clause is not empty, add an AND clause to the beginning of the string
      whereClause += `${this.appendAndOrClause(
        whereClause,
        'AND'
      )} status = ($${this.parameterizedIndexInc()})`;
      // append where clause values for status
      this.parameterizedValues.push(`${this.queryString.status}`);
    }

    // if whereClause string is populated, add WHERE in the beginning of the string
    if (whereClause !== '') {
      whereClause = `WHERE ${whereClause}`;
    }

    return this;
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

  appendAndOrClause(stringToCheck, pgKeywordToAppend) {
    // BUG for WHERE/AND clause add function that checks if the current query string is empty. if not add and
    // Only filter needs AND?????
    return stringToCheck !== '' ? pgKeywordToAppend : '';
  }

  parameterizedIndexInc() {
    // BUG add function that dynamically adds Parameterized query and Parameterized values
    this.parameterizedIndex += 1;
    return this.parameterizedIndex;
  }
}

module.exports = SearchFeatures;
