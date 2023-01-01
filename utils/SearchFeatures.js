class SearchFeatures {
  constructor(query, queryString, parameterizedValues = []) {
    // these are the query values passed in from node AKA req.query
    this.query = query;
    this.queryString = queryString;
    this.filterString = '';
    this.parameterizedValues = parameterizedValues;

    this.parameterizedIndex = 0;
  }

  filter(qTextFilterQuery = '') {
    // add comic type: oneshot, graphic novel, comic still needs to be added here
    const {
      q,
      status,
      contentRating,
      username,
      include,
      exclude,
      allowDeactivatedUserResults
    } = this.queryString;

    // if a text search/q is present
    if (q) {
      // for every dollar sign found in qTextFilterQuery, push the q value to parameterizedValues, increment parameterizedIndex
      const newQString = [...qTextFilterQuery]
        .map((element) => {
          if (element === '$') {
            this.parameterizedValues.push(`${q}%`);
            element = this.parameterizedIndexIncStr();
          }

          return element;
        })
        .join('');

      this.filterString += `${newQString} `;
    }

    if (status) {
      // if the where clause is not empty, add an AND clause to the beginning of the string
      this.appendClauseAndDataInsert(`status`, status);
    }

    if (contentRating) {
      this.multiValQStrAppend('books.content_rating', contentRating, 'IN');
    }
    // // If no content Rating is provided, by default search all content ratings except E if books or issues
    // else if (this.filterString.includes('books')) {
    //   this.multiValQStrAppend('books.content_rating', 'T', 'IN');
    // }

    if (username) {
      this.appendClauseAndDataInsert(`username`, username);
    }

    // By default, only the works of users who have active accounts are shown
    if (!allowDeactivatedUserResults) {
      this.appendClauseAndDataInsert(`users.active`, true);
    }

    if (include) {
      this.multiValQStrAppend('genres.genre', include, 'IN');
    }

    if (exclude) {
      this.multiValQStrAppend('genres.genre', exclude, 'NOT IN');
    }

    // if this.filterString string is populated, add WHERE in the beginning of the string
    if (this.filterString !== '') {
      this.filterString = `WHERE ${this.filterString}`;
    }

    this.query = `${this.query} ${this.filterString}`;

    return this;
  }

  sort(tableColumnPrefix = '') {
    // most popular, most viewed, most likes still need to be added
    let sort;
    let ascOrDesc;

    // if a specific sort has been added, sort by those results
    switch (this.queryString.sort) {
      case 'desc':
        sort = 'date_created';
        ascOrDesc = 'DESC';
        break;
      default:
        // by default, sort by newest/most recently added case
        sort = 'date_created';
        ascOrDesc = 'ASC';
    }

    this.query = `${this.query} ORDER BY ${tableColumnPrefix}.${sort} ${ascOrDesc}`;

    return this;
  }

  paginate(defaultLimit) {
    const page = this.queryString.page * 1 || 1;
    const limit = (this.queryString.limit || defaultLimit) * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = `${this.query} LIMIT ${limit} OFFSET ${skip}`;

    return this;
  }

  parameterizedIndexVal() {
    return this.parameterizedIndex;
  }

  incrementParameterizedIndex() {
    this.parameterizedIndex += 1;
  }

  parameterizedIndexIncStr() {
    /* 
      This increments parameterizedIndex so that Parameterized query statements can be added dynamically ie ($3) or ($1)
      later a function may need to be added that counts how many $ are in the given query expression so that the correct Parameterized query value can be added
      let parameterizedIndex = this.query.match(/\$/g).length;
    */

    this.incrementParameterizedIndex();
    // increment the Parameterized Index and return that value in a string for parameterizedValues to use later
    return `($${this.parameterizedIndexVal()})`;
  }

  appendToParameterizedValues(paramVal) {
    // add a value to the param values array
    this.parameterizedValues.push(paramVal);
  }

  appendAndOrClause(pgKeywordToAppend, columnCondition) {
    // If the provided string empty, add the pgKeywordToAppend ie AND or OR, else return an empty string

    const addAndOrClause = this.filterString !== '' ? pgKeywordToAppend : '';
    this.filterString += ` ${addAndOrClause} ${columnCondition}`;
    // return stringToCheck !== '' ? pgKeywordToAppend : '';
  }

  appendClauseAndDataInsert(column, paramVal, pgKeyword = 'AND') {
    // this method not only appends AND or OR to the filtered string, but it also adds and compares the column to paramVal and inserts the data into the parameterizedValues array
    this.appendAndOrClause(
      pgKeyword,
      `${column} = ${this.parameterizedIndexIncStr()}`
    );

    this.appendToParameterizedValues(paramVal);
  }

  multiValQStrAppend(columnName, strMultiVal, inClause, pgKeyword = 'AND') {
    /*
      this method iterates over a query str with multiple values ie action,adventure appends to the query str
      by separating the string it an array and mapping over them
     */
    const params = [];

    strMultiVal.split(',').forEach((val) => {
      params.push(this.parameterizedIndexIncStr());
      this.appendToParameterizedValues(val);
    });

    this.appendAndOrClause(
      pgKeyword,
      `${columnName} ${inClause} (${params.join(',')})`
    );
  }
}

module.exports = SearchFeatures;
