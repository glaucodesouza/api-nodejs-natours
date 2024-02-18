const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  //multiply by 1, to turn it Integer
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next(); //go to next Middleware function...
};

// GET Tours (Get all tours)
exports.getAllTours = (req, res) => {
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
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //=====>trick in Javascript to format string to integer
  const tour = tours.find((el) => el.id === id);

  // REPLACED by function put ABOVE the code...exports.checkID
  // // if (id > tours.length) {
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// POST for /api/v1/tours (Create Tour)
exports.createTour = (req, res) => {
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
exports.updateTour = (req, res) => {
  // REPLACED by function put ABOVE the code...exports.checkID
  // if (req.params.id * 1 > tours.length) {
  //   //multiply by 1, to turn it Integer
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

// DELETE Tour
exports.deleteTour = (req, res) => {
  // REPLACED by function put ABOVE the code...exports.checkID
  // //204 response is
  // res.status(204).json({
  //   status: 'success',
  //   data: null,
  // });
};
