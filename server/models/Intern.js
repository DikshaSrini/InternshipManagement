const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({
  name: String,
  position: String,
  institution: String,
  skills: [String],
  socialLinks: [
    {
      platform: String,
      url: String,
    },
  ],
  duration: String,
  description: String,
  status: String,
  funFact: String,
  image: String,
  preferences: [String]
});

module.exports = mongoose.model("Intern", internSchema);
