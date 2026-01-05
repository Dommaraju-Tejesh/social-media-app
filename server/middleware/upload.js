const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social-media-posts",
    // Added webp to support modern image formats
    allowed_formats: ["jpg", "jpeg", "png", "webp"], 
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;