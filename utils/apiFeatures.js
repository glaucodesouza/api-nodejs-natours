/*
NOTE:
So, the APIFeatures class expects a mongoose query object as an input. The way we create a query object is by creating a query with Tour.find(), but not executing the query right away, so not using await on it (in case we're using async/await like we do in the course).
Again, by doing this, we end up with a query object onto which we can then chain other methods, such as sort, or another find, as you posted in your example:
this.query.find(JSON.parse(queryStr))
Keep in mind that here, inside the class, this.query is the query object we created in the beginning, so it's like having:
Tour.find().find(JSON.parse(queryStr))
And yes, that is totally acceptable. Again, because the query has not yet executed, it didn't return the actual results yet. That's what we do in the end, which is the reason why in the end we have to use
const tours = await features.query;

Does it make more sense now?
Jonas
*/
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields'
    ];
    excludedFields.forEach(
      element => delete queryObj[element]
    );

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}` //NOTE: $ is to concatenate $ in the init of matched word in variable ${match}.
    );

    this.query = this.query.find(
      JSON.parse(queryStr)
    ); //NOTE: this command is to read all tours from table

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(',')
        .join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // If user do not use sort, lets sort by createdAt descending (using -)
      this.query = this.query.sort(
        '-createdAt'
      );
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(',')
        .join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //NOTE: -: minus here means except __v which is a standard field for MongoDB and we can not remove.
    }
    return this;
  }

  paginate() {
    // * 1 to convert string to a number
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // ?limit=10&page=2, 1-10, page 1, 11-20, page 2, 21-30, page 3
    this.query = this.query
      .skip(skip)
      .limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
