const express = require('express'); //requiring express module
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); //app variable for express
//----------------------------------------------------------------
// 1) MIDDLEWARERS
// middleware that executes in the middle of processing a request
//----------------------------------------------------------------
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋🏻');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//----------------------------------------------------------------
// 3) ROUTES
//----------------------------------------------------------------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
