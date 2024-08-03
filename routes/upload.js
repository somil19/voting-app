const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
require("dotenv").config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
console.log("multer is setup");
router.post("/upload", upload.single("image"), (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Image upload failed" });
      }
      // Save the result.url in your database as the image URL
      res.status(200).json({ imageUrl: result.url });
    }
  );

  stream.end(req.file.buffer);
});

module.exports = router;
