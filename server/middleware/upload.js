const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "social-media-posts",
      // Removing 'allowed_formats' temporarily to see if it bypasses the crash
      public_id: `avatar-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;