const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "Please login to create a new listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; 
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    //The .equals() method is needed because these _id fields are likely MongoDB ObjectIds, and comparing them using === won't work.
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); //validate the data using schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Combine all validation error messages into a single string and map will iterate over each element and get the message
    throw new ExpressError(400, errMsg);
  } else {
    next(); // proceed to the next middleware/route handler if validation passes
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); //validate the data using schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Combine all validation error messages into a single string and map will iterate over each element and get the message
    throw new ExpressError(400, errMsg);
  } else {
    next(); // proceed to the next middleware/route handler if validation passes
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  //if the review author is not equal to the user who wants to edit give a error
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    //The .equals() method is needed because these _id fields are likely MongoDB ObjectIds, and comparing them using === won't work.
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
