const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
// const reviewValidate = require("../utilities/review-validation");
const utilities = require("../utilities/");

//route to editReview view
router.get(
  "/editReview/:review_id",
  utilities.handleErrors(reviewController.buildEditReviewView)
);

//route to editReview process
router.post(
  "/editReview",
  utilities.handleErrors(reviewController.processEditReview)
);

//route to deleteReview view
router.get(
  "/deleteReview/:review_id",
  utilities.handleErrors(reviewController.deleteReviewView)
);

//route to deleteReview process
router.post(
  "/deleteReview",
  utilities.handleErrors(reviewController.processDeleteReview)
);

module.exports = router;