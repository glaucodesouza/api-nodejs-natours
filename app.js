const fs = require('fs');
const express = require('express'); //requiring express module

const app = express(); //app variable for express

app.use(express.json()); //middleware that executes in the middle of processing a request

// get request from browser
// get = http method
// req = request
// res = response
// '/' = url
// app.get('/', (req, res) => {
//   // res.status(200).send('Hello from the server side!'); //send response for the client side with 200=success
//   //sending response for client side
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...'); //send response for the client side
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//----------------------------------------------------------------
// GET /api/v1/tours
//----------------------------------------------------------------
app.get('/api/v1/tours/:id', (req, res) => {
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
});

//----------------------------------------------------------------
// POST /api/v1/tours
//----------------------------------------------------------------
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

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
});

//----------------------------------------------------------------
// PATCH
//----------------------------------------------------------------
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

//start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
