const express = require("express");
const router = express.Router();
const {
  getMe,
  updateProfile,
  uploadAvatar,
  searchUsers,
  followUser,
  unfollowUser,
  getUserProfile,
  deleteAccount,
  getFriends,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ FIX

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
// This tells the server to accept either "image" OR "avatar"
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.get("/search", protect, searchUsers);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.delete("/delete-account", protect, deleteAccount);
router.get("/friends", protect, getFriends);
router.get("/:id/profile", protect, getUserProfile);

module.exports = router;
