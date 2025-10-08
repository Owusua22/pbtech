const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByUser,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Extra filters
router.get("/project/:projectId", getTasksByProject);
router.get("/user/:userId", getTasksByUser);

module.exports = router;
