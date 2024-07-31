const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const staticRouter = require("./routes/staticRoute");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(bodyParser.json());
const PORT = process.env.PORT || 7000;
app.use(express.urlencoded({ extended: true }));
const { connectMongoDb } = require("./connection");
const { jwtAuthMiddleware } = require("./jwt");

//connecting to mongodb
connectMongoDb(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use("/user", userRouter);
app.use("/admin", jwtAuthMiddleware, adminRouter);
app.use("/", staticRouter);
app.set("view engine", "ejs"); // setting the view engine to ejs

app.set("views", path.resolve("./views")); // setting the views folder to views/ejs

app.use(express.static("views"));
app.use("/image", express.static("views/images"));

app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} , ${new Date()} `);
});
