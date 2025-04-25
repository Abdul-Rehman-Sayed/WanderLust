const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //for hashing the password and storing it in the database and it will also add username and password fields to the schema automatically with salting and hashing

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose); //this will add username and password fields to the schema automatically with salting and hashing

module.exports = mongoose.model("User", userSchema);
