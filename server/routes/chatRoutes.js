const express = require("express");
const router = express.Router();
const { getChatUsers, getOrCreateChat, postMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getChatUsers);
router.get("/:userId", protect, getOrCreateChat);
router.post("/:chatId/messages", protect, postMessage);

module.exports = router;
