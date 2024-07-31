
const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const upload = require("../uploads/multer");
const secret = process.env.JWT_KEY;
router.post("/addCandidate", upload, async (req, res) => {
  const { name, country } = req.body;
  const exsistingCandidate = await Candidate.findOne({ country });
  if (exsistingCandidate) {
    return res.render("addCand", { country_error: "Country already exists!" });
  }
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const candidate = new Candidate({ name, country, imageUrl });
    await candidate.save();
    res.render("addCand", { success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/deleteCandidate", async (req, res) => {
  const { name, country, secretKey } = req.body;
  console.log(name, country, secretKey);
  if (secretKey !== "sam@19") {
    return res.render("deleteCand", { secretKey_error: "Invalid Secret Key" });
  }
  const candidate = await Candidate.findOne({ name, country });
  console.log(candidate);
  if (!candidate) {
    res.render("deleteCand", { error: "Candidate not found" });
  }
  try {
    await Candidate.deleteOne({ name, country });
    res.render("deleteCand", { success: true });
  } catch (error) {
    res.render("deleteCand", { error: error.message });
  }
});
router.post("/updateCandidate/valid", async (req, res) => {
  const { name, country, secretKey } = req.body;
  if (secretKey !== secret) {
    return res.render("updateCand", { secretKey_error: "Invalid Secret Key" });
  }
  const candidate = await Candidate.findOne({ name, country });
  console.log("can found", candidate);
  if (!candidate) {
    return res.render("updateCand", {
      success: false,
      error: "Candidate not found",
    });
  }
  try {
    return res.render("updateCand", { success: true, candidate });
  } catch (error) {
    return res.render("updateCand", { error: error.message });
  }
});
router.post("/updateCandidate", upload, async (req, res) => {
  const { newName, newCountry, name, country } = req.body;
  const newImageUrl = req.file ? req.file.filename : null; // Access the uploaded file

  try {
    const candidate = await Candidate.findOne({ name, country });
    if (!candidate) {
      return res.render("updateCand", { error: "Candidate not found" });
    }

    if (newName) candidate.name = newName;
    if (newCountry) candidate.country = newCountry;
    if (newImageUrl) candidate.imageUrl = `/uploads/${newImageUrl}`;

    await candidate.save();

    return res.render("updateCand", {
      success: true,
      candidate,
      message: "Candidate updated successfully!",
    });
  } catch (error) {
    return res.render("updateCand", { error: error.message });
  }
});

module.exports = router;