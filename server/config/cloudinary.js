const dotenv = require("dotenv");
dotenv.config(); // Load .env FIRST

const cloudinary = require("cloudinary").v2;

// Log for debugging
console.log("🔍 CLOUDINARY ENV CHECK:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
