const express = require('express'); //requiring express module
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); //app variable for express
//----------------------------------------------------------------
// 1) MIDDLEWARERS
// middleware that executes in the middle of processing a request
//----------------------------------------------------------------
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

//Handle all routes and urls (get, post, put, delete, etc)
//all=all the verbs create, post, deletc, etc
//'*' means all the routes /api/v1/tours, etc.
//IMPORTANT:
//Don't put it in the start of the file...
//IT WILL ONLY give this error, because executions reached this function here.
//SO it is because it did not find another correct route.
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
