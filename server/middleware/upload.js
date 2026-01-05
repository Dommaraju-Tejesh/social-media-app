const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Ensure this matches the import name
  params: async (req, file) => {
    return {
      folder: "social-media-posts",
      format: 'png', // Force a format to test if it bypasses the error
      public_id: `avatar-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });
module.exports = upload;