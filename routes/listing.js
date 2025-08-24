const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); // Middleware for handling multipart/form-data, which is used for uploading files
const { storage } = require("../cloudConfig.js"); // Import the storage configuration from cloudinary
const upload = multer({ storage }); // Create a multer instance with the storage configuration

//Index Route and Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index)) //single function index from listingController
  .post(
    isLoggedIn,
    upload.single("listing[image]"), // Middleware to handle single file upload with the field name 'listing[image]'
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Route (kept above show route because if kept below, app.js identifies new as id and gives an error)
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route, Update Route and Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), // Middleware to handle single file upload with the field name 'listing[image]'
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
