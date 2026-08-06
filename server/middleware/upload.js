const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: "social-media-posts",
      resource_type: isVideo ? "video" : "image",
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

// 👇 Add this OUTSIDE the params() function
storage._handleFile = ((original) => (req, file, cb) => {
  console.log("Uploading:", file.originalname);

  original.call(storage, req, file, (err, result) => {
    console.log("UPLOAD CALLBACK ERROR:", err);
    console.log("UPLOAD CALLBACK RESULT:", result);

    cb(err, result);
  });
})(storage._handleFile);

const upload = multer({ storage });

module.exports = upload;