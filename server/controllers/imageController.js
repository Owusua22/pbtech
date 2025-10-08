const cloudinary = require("../config/cloudinary");
const Image = require("../models/Image");

// 📤 Upload new image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const newImage = new Image({
      name: req.body.name || "Untitled Image",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// 📸 Get all images
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

// 🗑️ Delete image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// ✏️ Update image (name or replace image)
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // If a new file is uploaded, replace the old one
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(image.publicId);

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);

      image.imageUrl = result.secure_url;
      image.publicId = result.public_id;
    }

    // Update name if provided
    if (name) image.name = name;

    await image.save();

    res.json({
      message: "Image updated successfully",
      updatedImage: image,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
