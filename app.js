const fs = require('fs');
const express = require('express'); //requiring express module
const morgan = require('morgan');

const app = express(); //app variable for express
//----------------------------------------------------------------
// 1) MIDDLEWARERS
//----------------------------------------------------------------
app.use(morgan('dev'));
app.use(morgan('tiny'));

app.use(express.json()); //middleware that executes in the middle of processing a request

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋🏻');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

//----------------------------------------------------------------
// 2) ROUTE HANDDLERS
//----------------------------------------------------------------

// GET Tours (Get all tours)
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

// GET Tour (Get tour)
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //=====>trick in Javascript to format string to integer
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      error: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// POST for /api/v1/tours (Create Tour)
const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    { id: newId },
    req.body
  );

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// PATCH (Update Tour)
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    //multiply by 1, to turn it Integer
    return res.status(404).json({
      status: 'fail',
      error: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

// DELETE Tour
const deleteTour = (req, res) => {
  //multiply by 1, to turn it Integer
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      error: 'Invalid ID',
    });
  }

  //204 response is
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// USERS
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exist',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exist',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exist',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exist',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exist',
  });
};

//----------------------------------------------------------------
// 3) ROUTES
//----------------------------------------------------------------
const tourRouter = express.Router();
const userRouter = express.Router();

// Tours
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Users
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .get(getAllUsers)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//----------------------------------------------------------------
// 4) START SERVER
//----------------------------------------------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
