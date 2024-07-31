const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
