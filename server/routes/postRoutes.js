const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  toggleLike,
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Create Post
router.post("/", protect, upload.single("image"), createPost);

// Get Posts
router.get("/", protect, getAllPosts);
router.get("/user/:userId", protect, getUserPosts);

// Delete Post
router.delete("/:id", protect, deletePost);

// Like / Unlike
router.post("/:id/like", protect, toggleLike);

// Comments
router.post("/:id/comments", protect, addComment);

// Edit Comment
router.put(
  "/:postId/comments/:commentId",
  protect,
  editComment
);

// Delete Comment
router.delete(
  "/:postId/comments/:commentId",
  protect,
  deleteComment
);

module.exports = router;