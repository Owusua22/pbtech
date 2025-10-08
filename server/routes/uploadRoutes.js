const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

// Multer config (temp storage)
const upload = multer({ dest: "uploads/" });

// Route for uploading single file
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
