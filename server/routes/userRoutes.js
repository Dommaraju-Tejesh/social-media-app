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
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ Cloudinary

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.get("/search", protect, searchUsers);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.get("/:id/profile", protect, getUserProfile);

module.exports = router;
