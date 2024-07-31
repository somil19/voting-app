const express = require("express");
const { jwtAuthMiddleware, jwtParser } = require("../jwt");
const Candidate = require("../models/candidate");
const User = require("../models/user");
const router = express.Router();

// router.get("/", async (req, res) => {});

router.get("/signup", (req, res) => {
  return res.render("signUp");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.get("/", jwtParser, async (req, res) => {
  const user = await User.findById(req.user.id);

  console.log(req.user);
  console.log(user);
  if (user && user.role === "admin") {
    return res.redirect("/adminPanel");
  }
  return res.render("home");
});
router.get("/selectCandidate", jwtAuthMiddleware, async (req, res) => {
  const candidates = await Candidate.find();
  const user = req.user;

  console.log(candidates, user);
  console.log("aadhar:-", user.aadhar);
  return res.status(200).render("selectCandidate", { candidates, user });
});

router.get("/adminPanel", jwtAuthMiddleware, async (req, res) => {
  const candidate = await Candidate.find();
  return res.render("adminPanel", { candidate });
});
router.get("/listcandiates", async (req, res) => {
  const candidates = await Candidate.find();
  console.log("list", candidates);
  return res.render("candidates", { candidates });
});
router.get("/admin/addCandidate", jwtAuthMiddleware, (req, res) => {
  return res.render("addCand");
});
router.get("/admin/deleteCandidate", jwtAuthMiddleware, (req, res) => {
  return res.render("deleteCand");
});
router.get("/admin/updateCandidate", jwtAuthMiddleware, (req, res) => {
  return res.render("updateCand", { success: false });
});
router.get("/admin/updateCandidate/valid?", async (req, res) => {
  return res.render("updateCand", { success: false });
});

router.get("/livePoll", async (req, res) => {
  const users = await User.find();
  console.log("users", users);
  const sortedCandidates = await Candidate.find().sort({ votes: -1 });
  console.log("sortedCandidates", sortedCandidates);
  return res.render("live-voting", { users, sortedCandidates });
});
router.get("/deleteCandidate", (req, res) => {
  return res.render("deleteCand");
});

module.exports = router;
