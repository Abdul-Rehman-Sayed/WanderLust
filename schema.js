const Joi = require("joi"); //joi -> for making schema for validation on server side
const review = require("./models/review");

module.exports.listingSchema = Joi.object({
  //this is the schema for validation and it should be same as the model schema
  listing: Joi.object({
    //everything inside listing should be in object and the listing object should be required
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null), //allow empty string and null
    price: Joi.number().required().min(0), //price should be number and should be greater than 0
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid(
        "Trending",
        "Rooms",
        "Iconic cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic"
      )
      .allow("", null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    //everything inside review should be in object and the review object should be required
    rating: Joi.number().required().min(1).max(5), //rating should be number and should be between 1 and 5
    comment: Joi.string().required(), //comment should be string and should be required
  }).required(),
});
