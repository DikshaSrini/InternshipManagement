const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  requiredTech: [String],
});

module.exports = mongoose.model("Project", projectSchema);
