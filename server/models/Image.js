// models/Image.js
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true }, // used to delete from Cloudinary later
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
