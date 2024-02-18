const express = require('express');
const tourController = require('./../controllers/tourController');
//OR
// const {getAllTours, createTour, getTour, updateTour, deleteTour} = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkID);
// REPLACED by above code ^^^, which is a function in tourController.js
// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   next();
// });

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
