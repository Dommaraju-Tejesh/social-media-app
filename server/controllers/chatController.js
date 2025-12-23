const Chat = require("../models/Chat");
const User = require("../models/User");

// GET /api/chats
exports.getChatUsers = async (req, res) => {
  // simple: chat with people you follow
  const user = await User.findById(req.user._id).populate(
    "following",
    "username avatar"
  );
  res.json(user.following);
};

// GET /api/chats/:userId  -> get or create chat
exports.getOrCreateChat = async (req, res) => {
  const otherId = req.params.userId;
  const myId = req.user._id;

  let chat = await Chat.findOne({
    users: { $all: [myId, otherId] },
  }).populate("messages.sender", "username");

  if (!chat) {
    chat = await Chat.create({ users: [myId, otherId], messages: [] });
  }

  res.json(chat);
};

// POST /api/chats/:chatId/messages
exports.postMessage = async (req, res) => {
  const { text } = req.body;
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  const msg = { sender: req.user._id, text };
  chat.messages.push(msg);
  await chat.save();

  res.json(msg);
};
