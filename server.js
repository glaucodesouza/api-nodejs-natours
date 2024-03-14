const mongoose = require('mongoose');
const dotenv = require('dotenv'); //obs: need it for having environment variables for connections

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

// console.log(app.get('env')); //write environment variables on terminal
// console.log(process.env); // write environment variables on terminal

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
