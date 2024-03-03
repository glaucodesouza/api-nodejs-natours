// const fs = require('fs');
const Tour = require('./../models/tourModel');

// GET Tours (Get all tours)
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY

    //1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields'
    ];
    excludedFields.forEach(
      element => delete queryObj[element]
    );

    //2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);

    //INFO: make an advanced query for MongoDB
    // we need to concatenate a $ in thes words: gte|gt|lte|lt
    //INFO: regular expression meaning, for replacing gte|gt|lte|lt for $gte|$gt|$lte|$lt:
    // \b means exact to match word,
    // g means can have repeated words in string,
    // | means or operator.
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}` //INFO: $ is to concatenate $ in the init of matched word in variable ${match}.
    );
    console.log(JSON.parse(queryStr));

    // console.log(req.query);
    // { difficulty: 'easy', duration: { $gte: '5' } } //INFO: MongoDB use $
    // { difficulty: 'easy', duration: { gte: '5' } }
    //gte, gt, lte, lt

    const query = Tour.find(
      JSON.parse(queryStr)
    ); //INFO: this command is to read all tours from table

    // EXECUTE QUERY
    const tours = await query;

    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE TO USER IN FRONTEND
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res
      .status(404)
      .json({ status: 'fail', message: error });
  }
};

// GET Tour (Get tour)
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(
      req.params.id //INFO: 1)this id come from route file configuration and it will be informed in URL id parameter (.route(/:id))
    );
    // INFO: 2) For one, you could use: Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

// POST for /api/v1/tours (Create Tour)
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); // Promise

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

// PATCH (Update Tour)
//INFO:
// this function works only for PATCH method.
// do not work for PUT method because we coauld fill up all fields when calling it.
exports.updateTour = async (req, res) => {
  try {
    //INFO: lets use a mongose method (findByIdAndUpdate)
    // which returns a mongose Query object.
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });

    //INFO: we also could use tour: tour
    //but we can hide it because it has the same name (tour).
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     tour: tour       <--------here
    //   }
    // });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

// DELETE Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

// // const fs = require('fs');
// const Tour = require('./../models/tourModel');

// //commenting because it was for local testing purposes from json file
// // const tours = JSON.parse(
// //   fs.readFileSync(
// //     `${__dirname}/../dev-data/data/tours-simple.json`
// //   )
// // );

// // Commented out because it was for local testing purposes from json file
// // Middleware function for validating the ID of the Routes
// //It will run before CRUD methods...
// // exports.checkID = (req, res, next, val) => {
// //   console.log(`Tour id is: ${val}`);
// //   //multiply by 1, to turn it Integer
// //   if (req.params.id * 1 > tours.length) {
// //     return res.status(404).json({
// //       status: 'fail',
// //       message: 'Invalid ID'
// //     });
// //   }
// //   next(); //go to next Middleware function...
// // };

// // Commented out because it was for local testing purposes from json file
// // exports.checkBody = (req, res, next) => {
// //   if (!req.body.name || !req.body.price) {
// //     return res.status(400).json({
// //       status: 'fail',
// //       message: 'Missing name and price'
// //     });
// //   }
// //   next(); //go to next middleware function...
// // };

// // GET Tours (Get all tours)
// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime
//     // results: tours.length,
//     // data: {
//     //   tours
//     // }
//   });
// };

// // GET Tour (Get tour)
// exports.getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1; //=====>trick in Javascript to format string to integer

//   // Commented because it was for local testing with a JSON local file
//   // const tour = tours.find(el => el.id === id);

//   // // REPLACED by function put ABOVE the code...exports.checkID
//   // // // if (id > tours.length) {
//   // // if (!tour) {
//   // //   return res.status(404).json({
//   // //     status: 'fail',
//   // //     message: 'Invalid ID',
//   // //   });
//   // // }

//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tour
//   //   }
//   // });
// };

// // POST for /api/v1/tours (Create Tour)
// exports.createTour = async (req, res) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success'
//     // data: {
//     //   tour: newTour
//     // }
//   });
//   // comented because it was for local testing with a JSON local file
//   // // console.log(req.body);
//   // const newId = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign(
//   //   { id: newId },
//   //   req.body
//   // );
//   // tours.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/../dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   err => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour
//   //       }
//   //     });
//   //   }
//   // );
// };

// // PATCH (Update Tour)
// exports.updateTour = (req, res) => {
//   // REPLACED by function put ABOVE the code...exports.checkID
//   // if (req.params.id * 1 > tours.length) {
//   //   //multiply by 1, to turn it Integer
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid ID',
//   //   });
//   // }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here>'
//     }
//   });
// };

// // DELETE Tour
// exports.deleteTour = (req, res) => {
//   // REPLACED by function put ABOVE the code...exports.checkID
//   // //204 response is
//   // res.status(204).json({
//   //   status: 'success',
//   //   data: null,
//   // });
// };
