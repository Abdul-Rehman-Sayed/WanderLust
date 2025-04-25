const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    //adds a new field to the object (or replaces it if it already existed).
    ...obj,
    owner: "680678b500b477ef4d3e1100",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
