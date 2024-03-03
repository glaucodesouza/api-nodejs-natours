const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //INFO: need it for having environment variables for connections
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

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

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/tours-simple.json`,
    'utf-8'
  )
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DB:
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//INFO: process.argv[2] is the third argument.
//INFO: it can be --import or --delete
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
