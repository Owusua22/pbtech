const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
  deadline: Date,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
