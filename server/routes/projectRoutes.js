const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleArchiveProject,
  uploadProjectMedia,
  deleteProjectMedia,
} = require("../controllers/projectController");

const router = express.Router();

/**
 * Multer setup - store files temporarily before uploading to Cloudinary
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/**
 * Project CRUD
 */
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/archive", toggleArchiveProject);

/**
 * Project Media
 */
router.post("/:projectId/media", upload.single("file"), uploadProjectMedia);
router.delete("/:projectId/media/:mediaId", deleteProjectMedia);

module.exports = router;
