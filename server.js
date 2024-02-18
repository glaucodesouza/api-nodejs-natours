const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE2.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//----------------------------------------------------------------
// DATABASE connection
// mongoose is an higher layer abstraction for mongoDB
//----------------------------------------------------------------
mongoose
  // local database version
  // .connect(process.env.DATABASE_LOCAL, {
  // hosted database Atlas version
  .connect(DB, {
    // just some options to deal with deprecation warnings.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() =>
    console.log('DB connection successful!')
  )
  .catch(err => console.log(err));

//----------------------------------------------------------------
// mongoose Schema
//----------------------------------------------------------------
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5,
    required: [
      true,
      'A tour must have a rating'
    ]
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 997
});

testTour
  .save() //Promise to save document to the DB
  .then(doc => console.log(doc))
  .catch(err => console.log('ERROR 💥', err));

// console.log(app.get('env')); //write environment variables on terminal
// console.log(process.env); // write environment variables on terminal

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
