const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social-media-posts",
    // Adding webp and letting cloudinary handle auto-formatting
    allowed_formats: ["jpg", "jpeg", "png", "webp"], 
  },
});

const upload = multer({ storage });
module.exports = upload;