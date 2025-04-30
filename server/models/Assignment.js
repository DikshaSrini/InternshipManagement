const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  type: String, 
  projectId: mongoose.Schema.Types.Mixed, 
  assignments: [mongoose.Schema.Types.Mixed] 
});

module.exports = mongoose.model("Assignment", assignmentSchema);
