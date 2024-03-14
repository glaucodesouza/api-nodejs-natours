const express = require('express');
const tourController = require('./../controllers/tourController');
//OR
// const {getAllTours, createTour, getTour, updateTour, deleteTour} = require('./../controllers/tourController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours
  );

router
  .route('/tour-stats')
  .get(tourController.getTourStats);

// obs:
// Commented out because it was for local testing purposes
// router.param('id', tourController.checkID); //just for Get, Update, Delete methods

// REPLACED by above code ^^^, which is a function in tourController.js
// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   next();
// });
// Create a checkBody Middleraware function
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
