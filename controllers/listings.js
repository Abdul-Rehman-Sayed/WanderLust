const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let filter = {};
  // Search by title, location, or country
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
    ];
  }
  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListings,
    searchQuery: req.query.search || "",
    activeCategory: req.query.category || "",
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  //fetch the full review documents, Go inside each review and also fetch the full user who wrote it
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //populate will get the data from the review collection and owner collection and show it in the listing page
  if (!listing) {
    req.flash("error", "Cannot find that Listing!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient //does forward and backward geocoding here forward is used
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1, //limit the number of results to 1 basically we are looking for one location
    })
    .send(); //here we are sending the request to the mapbox api and getting the response
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing); //this will provide the object with key and value only and if we write only req.body it will provide the listing object. We make it new Listing to create an instance (copy)
  newListing.owner = req.user._id;
  newListing.image = { url, filename }; //this will save the image url and filename in the listing collection
  newListing.geometry = response.body.features[0].geometry; //this will save the location in the listing collection and the location is in the object feature and the location is in the object geometry
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "Successfully Created a New Listing!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that Listing!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); //this will replace the original image url with the new one containing width provided by cloudinary
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // Geocode the new location first
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // Get the new geometry
  let newGeometry = response.body.features[0].geometry;
  // Find the listing and update its text fields
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // Set the new geometry on the listing object
  listing.geometry = newGeometry;
  // If a new file was uploaded, update the image
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  // Save all changes (including new geometry and possibly new image)
  await listing.save();
  req.flash("success", "Successfully Updated Listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Successfully Deleted Listing!");
  res.redirect("/listings");
};
