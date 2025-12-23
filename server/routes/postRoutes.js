const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  toggleLike,
  addComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", protect, upload.single("image"), createPost);
router.get("/", protect, getAllPosts);
router.get("/user/:userId", protect, getUserPosts);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);

module.exports = router;
