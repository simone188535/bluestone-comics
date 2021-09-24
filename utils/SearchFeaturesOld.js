class SearchFeatures {
  constructor(query, queryString, textSearch = false) {
    this.query = query;
    this.queryString = queryString;
    this.textSearch = textSearch;
  }

  filter() {
    const queryObj = { ...this.queryString };

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|eq|ne)\b/g,
      (match) => `$${match}`
    );

    let searchQuery = {};

    if (this.textSearch) {
      if (this.queryString.q) {
        // if queryString.q /text search is present, do a text search and add queryProjection for assist sorting

        searchQuery = Object.assign(searchQuery, {
          $text: { $search: this.queryString.q }
        });
      } else {
        // if queryString.q is present but, is empty, Show all results, do not add queryProjection

        searchQuery = Object.assign(searchQuery, { _id: { $exists: true } });
      }
    } else {
      // search altered query string and parse, do not add queryProjection

      searchQuery = JSON.parse(queryStr);
    }

    this.query = this.query.find(searchQuery);
    return this;
  }

  sort(defaultValue) {
    const sortQuery = {};

    if (this.queryString.q) {
      Object.assign(sortQuery, {
        score: { $meta: 'textScore' }
      });
    }

    if (this.queryString.sort) {
      // sort when values are provided

      // make an array of the sort values
      const sortBy = this.queryString.sort.split(',');

      sortBy.forEach((sortByValue) => {
        /*
          If you ever decide to use Descending sorts add a conditional which checks if theres a - (i.g. -test) 
          in the value (by using .includes()). Then use .split() to seperate by the - sign. then assign the value 
          to this. const sortByObject = { [sortBy[index]]: -1 };
          */
        const sortByObject = { [sortByValue]: 1 };
        Object.assign(sortQuery, sortByObject);
      });

      this.query = this.query.sort(sortQuery);
    } else {
      // sort when no values are provided
      const defaultSort = defaultValue || 'dateCreated';

      Object.assign(sortQuery, {
        [defaultSort]: 1
      });

      this.query = this.query.sort(sortQuery);
    }

    return this;
  }

  limitFields() {
    // Removes or shows certain fields
    // This field needs to be enabled if this.queryString.q / text search
    const limitQuery = {};

    if (this.queryString.q) {
      Object.assign(limitQuery, {
        score: { $meta: 'textScore' }
      });
    }

    // DO NOT DELETE, MAY NEED EVETUALLY
    // if (this.queryString.fields) {
    //   const fields = this.queryString.fields.split(',');
    //   console.log('fields', fields);
    //   fields.forEach((fieldValue) => {
    //     /*
    //     If you ever decide to use Descending sorts add a conditional which checks if theres a - (i.g. -test)
    //     in the value (by using .includes()). Then use .split() to seperate by the - sign. then assign the value
    //     to this. const sortByObject = { [sortBy[index]]: -1 };
    //     */
    //     const sortByObject = { [fieldValue]: 1 };
    //     Object.assign(limitQuery, sortByObject);
    //   });

    //   this.query = this.query.select(limitQuery);
    // } else {
    //   this.query = this.query.select(limitQuery);
    // }
    this.query = this.query.select(limitQuery);

    return this;
  }

  paginate(defaultLimit) {
    const page = this.queryString.page * 1 || 1;
    const limit = (this.queryString.limit || defaultLimit) * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = SearchFeatures;