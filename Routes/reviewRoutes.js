const express = require('express');
const reviewController = require('./../Controllers/reviewController');
const AuthController = require('./../Controllers/AuthController');

const Router = express.Router({ mergeParams: true });
Router.use(AuthController.protect);
Router.route('/')
  .get(reviewController.GetAllReviews)
  .post(
    AuthController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
Router.route('/:id')
  .get(reviewController.getReview)
  .patch(
    AuthController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    AuthController.restrictTo('user', 'admin'),
    reviewController.DeleteReview
  );
module.exports = Router;
