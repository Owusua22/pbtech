const Task = require("../models/Task");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, status, deadline, priority } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      project,
      status,
      deadline,
      priority,
    });

    await task.save();

    // 🔑 Populate immediately after save
    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email") // populate with selected user fields
      .populate("project", "name"); // populate with project name
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, status, deadline, priority } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, project, status, deadline, priority },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔑 Return the task directly, not wrapped in { message, task }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Get tasks by project
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project tasks", error: error.message });
  }
};

// Get tasks by user
exports.getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user tasks", error: error.message });
  }
};
