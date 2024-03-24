const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'A tour must have a name'
      ],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal to 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more or equal to 10 characters'
      ],
      //spacifying a validator from npm module...
      validate: [
        validator.isAlpha,
        'Tour name must only contain characters'
      ]
    },
    slug: String,
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
      ],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [
        true,
        'A tour must have a price'
      ]
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // "this" works only with create()
          return val < this.price; //if val=100 < 200=true, but if val=250 < 200=false
        },
        message:
          'Discount price ({VALUE}) should be bellow regular price' //VALUE is the val variable
      }
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
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

tourSchema
  .virtual('durationWeeks')
  .get(function() {
    return this.duration / 7;
  });

// Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('We will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY Middleware
// tourSchema.pre('find', function(next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
// tourSchema.pre('findOne', function(next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(
    `Query took ${Date.now() -
      this.start} milliseconds`
  );
  next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function(next) {
  //obs: add in last position of array
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true }
    }
  });
  console.log(this.pipeline()); //obs: this points to aggregation object
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
