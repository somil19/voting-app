const mongoose = require("mongoose");
// const url = "mongodb://127.0.0.1:27017/samApp";

async function connectMongoDb(url) {
  console.log(url);
  return await mongoose.connect(url);
}
const db = mongoose.connection;

db.on("connected", () => {
  console.log("mongdb is connected");
});

db.on("disconnected", () => {
  console.log("mongodb is disconnected");
});

db.on("error", (err) => {
  console.log(err);
});
module.exports = { connectMongoDb };
