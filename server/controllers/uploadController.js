const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Upload single image
exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "projects", // optional: create a folder in Cloudinary
      resource_type: "auto",
    });

    // Delete local file after upload
    fs.unlinkSync(file.path);

    return res.status(200).json({
      message: "Upload successful",
      url: result.secure_url, // save this in MongoDB
      public_id: result.public_id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
