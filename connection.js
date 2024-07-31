const mongoose = require("mongoose");
// const url = "mongodb://127.0.0.1:27017/samApp";

async function connectMongoDb(url) {
  console.log(url);
  return await mongoose.connect(url);
}

module.exports = { connectMongoDb };
