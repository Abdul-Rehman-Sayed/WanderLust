const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    //authenticate() function, which is used as route middleware to authenticate requests.
    passport.authenticate("local", {
      //The string "local" refers to the strategy Passport.js should use to authenticate the user.
      failureRedirect: "/login",
      failureFlash: true, //flash message when authentication fails
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
