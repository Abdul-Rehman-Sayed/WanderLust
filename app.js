if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const port = 8080;
const dbUrl = process.env.ATLASDB_URL;
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport"); //passport is used for authentication
const LocalStrategy = require("passport-local"); //passport-local is a strategy for passport authentication
const User = require("./models/user.js");
const review = require("./models/review.js");

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true })); //to parse the data in request
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//using connect-mongo to store the session in the database
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //time in seconds after which the session will be updated. Interval (in seconds) between session updates.
});

store.on("error", (err) => {
  console.log("Error in mongo session store", err);
});

//using express-session to create a session
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash()); //flash messages

app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //use passport session to manage user sessions
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); //serialize user -> to store user details in session
passport.deserializeUser(User.deserializeUser()); //deserialize user -> to remove user from session

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //flash success message
  res.locals.error = req.flash("error"); //flash error message
  res.locals.currentUser = req.user; 
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = {
    email: "student@gmail.com",
    username: "deltastudent",
  };
  let registeredUser = await User.register(fakeUser, "helloworld"); //registering the user with username and password register(user, password, callback) callback is optional
  res.send(registeredUser);
});

//Routes
app.use("/listings", listingRouter); //Every route inside listing.js will be prefixed with /listings.
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  //if none of the paths work this will work so all * will be used
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler middleware for catching and displaying errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log(`Server is Connected to ${port}`);
});
