const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // IMPORTANT: Load variables before config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log to Render console to verify keys exist (only for debugging)
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "Missing");

module.exports = cloudinary;