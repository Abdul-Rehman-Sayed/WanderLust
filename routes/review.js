const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams will merge the params of the parent route with the child route. This is used to get the id of the listing in the review route. bcz the id will remain in app.js itself and reviews will not be able to identify the id
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Reviews --> Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Reviews --> Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyRoute)
);

module.exports = router;
