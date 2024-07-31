const express = require("express");
const router = express.Router();
const User = require("../models/user");
const secret = process.env.JWT_KEY;
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const app = express();
const cookieParser = require("cookie-parser");
const Candidate = require("../models/candidate");

// Use cookie-parser middleware
app.use(cookieParser());

router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { name, age, aadharNumber, password, role, secretKey } = req.body;

    // Checking if the role is admin and the secret key is correct
    if (role === "admin" && secretKey !== secret) {
      console.log("invalid secret key");
      return res
        .status(400)
        .render("signup", { secretKey_error: "Invalid secret key" });
    }

    //if adhar number already exists
    const user = await User.findOne({ aadharNumber });
    if (user) {
      return res
        .status(400)
        .render("signup", { aadhar_error: "Aadhar number already exists" });
    }

    // create the new user
    const newUser = await User.create({
      name,
      age,
      aadharNumber,
      password,
      role,
    });
    console.log("newUser-Saved");

    //save the new user in the database
    await newUser.save();
    const response = await newUser.save();
    console.log(response);

    //now redirect to login page
    res.status(201).redirect("/login");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: `Hey there we have an error:- ${error.message}` });
  }
});

router.post("/login", async (req, res) => {
  const { aadharNumber, password } = req.body;
  console.log("res", res);
  const user = await User.findOne({ aadharNumber });
  console.log(user);
  //if user doesn't exist or password doesn't match
  if (!user || !(await user.comparePassword(password))) {
    console.log("Invalid credentials");
    return res.status(400).render("login", { error: "Invalid credentials" });
  }

  //Now if everything is ok then generate jwt token and send it back to the client
  const payLoad = {
    aadhar: user.aadharNumber,
    id: user._id,
  };
  console.log(JSON.stringify(payLoad));
  //generate jwt token
  const token = generateToken(payLoad);

  // Set the token in the cookie
  res.cookie("token", token);

  if (user.role === "admin") {
    console.log("admin");
    return res.status(202).redirect("/adminPanel");
  }
  return res.status(202).render("home");
});

router.post("/vote", jwtAuthMiddleware, async (req, res) => {
  const { candidateId, userAadhar } = req.body;

  console.log("aadharNumber:", userAadhar);

  if (!candidateId || !userAadhar) {
    return res.status(400).send("Candidate ID and Aadhar Number are required.");
  }

  try {
    const user = await User.findOne({ aadharNumber: userAadhar });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.isVoted) {
      return res.status(400).render("thanku", { hasVoted: true });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).send("Candidate not found.");
    }

    // Update user's vote status
    user.isVoted = true;
    user.votedAt = new Date();
    await user.save();

    // Increment candidate's vote count
    candidate.votes = candidate.votes ? candidate.votes + 1 : 1;
    await candidate.save();

    res.render("thanku", { hasVoted: false });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
