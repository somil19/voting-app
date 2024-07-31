const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_KEY;

const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has authorization or not
  const token = req.cookies.token;
  console.log(token);
  if (!token) return res.status(401).redirect("/login");

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, secret);

    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).redirect("/login");
  }
};
const jwtParser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.render("home");
  try {
    const decoded = await jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "invalid token" });
  }
};

//Function to generate jwt token
const generateToken = (voter) => {
  return jwt.sign(voter, secret);
};

module.exports = { jwtAuthMiddleware, generateToken, jwtParser };
