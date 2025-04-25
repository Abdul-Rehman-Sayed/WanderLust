const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); //review object from show.ejs has comment and rating
  newReview.author = req.user._id; //author of the review
  listing.reviews.push(newReview); //push into the review array
  await newReview.save();
  await listing.save();
  console.log("New Review Saved");
  req.flash("success", "Successfully Created a New Review!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyRoute = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //this will remove the review id from the listing
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Deleted the Review!");
  res.redirect(`/listings/${id}`);
};
