const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: "social-media-posts",

      // Tell Cloudinary whether this is an image or a video
      resource_type: isVideo ? "video" : "image",

      // Allowed file formats
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "gif",
        "mp4",
        "mov",
        "avi",
        "mkv",
        "webm",
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;