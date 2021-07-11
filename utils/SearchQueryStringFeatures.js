class SearchFeatures {
  constructor(query, queryString, parameterizedValues = []) {
    // these are the query values passed in from node AKA req.query
    this.query = query;
    this.queryString = queryString;
    this.parameterizedValues = parameterizedValues;

    this.parameterizedIndex = 0;
  }

  filter(tableToSearch) {
    // add comic type: oneshot, graphic novel, comic still needs to be added here

    let whereClause = '';
    // if a text search/q is present
    if (this.queryString.q) {
      if (tableToSearch === 'books') {
        whereClause += `to_tsvector('english', coalesce(${tableToSearch}.title, '') || ' ' || coalesce(${tableToSearch}.description, '')) @@ plainto_tsquery('english', $${this.parameterizedIndexInc()}) `;
        // append where clause text search value
      } else if (tableToSearch === 'issues') {
        whereClause += `to_tsvector('english', coalesce(${tableToSearch}.title, '')) @@ plainto_tsquery('english', $${this.parameterizedIndexInc()}) `;
        // append where clause text search value
      }
      this.parameterizedValues.push(this.queryString.q);
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

    this.query = `${this.query} ${whereClause}`;

    return this;
  }

  sort(tableColumnPrefix = '') {
    // most popular, most viewed, most likes still need to be added
    let sort;
    let ascOrDesc;

    // if a specific sort has been added, sort by those results
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
    // If the provided string empty, add the pgKeywordToAppend ie AND or OR, else return an empty string
    return stringToCheck !== '' ? pgKeywordToAppend : '';
  }

  parameterizedIndexInc() {
    // This increments parameterizedIndex so that Parameterized query statements can be added dynamically ie ($3) or ($1)
    // later a function may need to be added that counts how many $ are in the given query expression so that the correct Parameterized query value can be added
    // let parameterizedIndex = this.query.match(/\$/g).length;

    this.parameterizedIndex += 1;
    return this.parameterizedIndex;
  }
}

module.exports = SearchFeatures;
