const express = require('express');
const tourController = require('./../Controllers/tourController');
const AuthController = require('./../Controllers/AuthController');
//const reviewController = require('./../Controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

// post/tour/234gt/reviews
// get/tour/234gt/reviews

/*Router.route('/:tourId/reviews').post(
  AuthController.protect,
  AuthController.restrictTo('user'),
  reviewController.createReview
);*/

const Router = express.Router();

Router.use('/:tourId/reviews', reviewRouter);
//Router.param('id', tourContoller.checkID);

Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.getAllTours
);
Router.route('/tour-stats').get(tourController.getTourStats);

Router.route('/monthly-plan/:year').get(
  AuthController.protect,
  AuthController.restrictTo('admin', 'Lead-guide', 'guide'),
  tourController.getMonthlyPlan
);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(
  tourController.getToursWithin
);

Router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
Router.route('/')
  .get(tourController.getAllTours)
  .post(
    AuthController.protect,
    AuthController.restrictTo('admin', 'Lead-guide'),
    tourController.CreateAllTours
  );

Router.route('/:id')
  .get(tourController.GetTour)
  .patch(
    AuthController.protect,
    AuthController.restrictTo('admin', 'Lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.UpdateTours
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo('admin', 'Lead-guide'),
    tourController.DeleteAllTours
  );

module.exports = Router;
