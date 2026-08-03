const express = require("express");
const router = express.Router();

const {
  getChatUsers,
  getOrCreateChat,
  postMessage,
  markMessageSeen,
  editMessage,
  deleteMessage,
  sharePost,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// Chat List
// ===============================
router.get("/", protect, getChatUsers);

// ===============================
// Open/Create Chat
// ===============================
router.get("/:userId", protect, getOrCreateChat);

// ===============================
// Send Message
// ===============================
router.post("/:chatId/messages", protect, postMessage);

// ===============================
// Seen / Unseen
// ===============================
router.patch("/:chatId/messages/seen", protect, markMessageSeen);

// ===============================
// Edit Message
// ===============================
router.patch("/:chatId/messages/:messageId/edit", protect, editMessage);

// ===============================
// Delete Message
// ===============================
router.delete("/:chatId/messages/:messageId", protect, deleteMessage);

// ===============================
// Share Post
// ===============================
router.post("/share", protect, sharePost);

module.exports = router;


