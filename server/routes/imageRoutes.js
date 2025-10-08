const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadImage,
  getImages,
  deleteImage,
  updateImage, // ✅ Added the update controller
} = require("../controllers/imageController");

const router = express.Router();

// 🗂️ Set up temporary local storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 📤 Upload image
router.post("/upload", upload.single("file"), uploadImage);

// 📸 Get all images
router.get("/", getImages);

// 🗑️ Delete image
router.delete("/:id", deleteImage);

// ✏️ Update image (name or replace file)
router.put("/:id", upload.single("file"), updateImage);

module.exports = router;
