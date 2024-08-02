const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const staticRouter = require("./routes/staticRoute");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const uploadRouter = require("./routes/upload");
app.use(bodyParser.json());
const PORT = process.env.PORT || 7000;
app.use(express.urlencoded({ extended: true }));
const { connectMongoDb } = require("./connection");
const { jwtAuthMiddleware } = require("./jwt");
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
//connecting to mongodb

connectMongoDb(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use(cookieParser());

//ROUTES
app.use("/api", uploadRouter);
app.use("/user", userRouter);
app.use("/admin", jwtAuthMiddleware, adminRouter);
app.use("/", staticRouter);

//Now using ejs
app.set("view engine", "ejs"); // setting the view engine to ejs
app.set("views", path.resolve("./views")); // setting the views folder to views/ejs

app.use(express.static("views"));
app.use("/image", express.static("views/images"));

app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`Server running on port, ${new Date()} `);
});
