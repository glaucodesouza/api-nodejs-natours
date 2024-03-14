const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [
      true,
      'A tour must have a duration'
    ]
  },
  maxGroupSize: {
    type: Number,
    required: [
      true,
      'A tour must have a Group Size'
    ]
  },
  difficulty: {
    type: String,
    required: [
      true,
      'A tour must have a difficulty'
    ]
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true,
    required: [
      true,
      'A tour must have a description'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [
      true,
      'A tour must have a cover image'
    ]
  },
  images: [String], //obs: an array of images
  createdAt: {
    type: Date,
    default: Date.now(), //obs: timestamp in miliseconds, immediataly converty to day state
    select: false //obs:remove from selection, so we do not pass it to user in frontend
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
