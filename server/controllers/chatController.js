const Chat = require("../models/Chat");
const User = require("../models/User");

// ===============================
// GET CHAT LIST
// ===============================
exports.getChatUsers = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate(
      "following",
      "username avatar",
    );

    const users = [];

    for (const friend of me.following) {
      const chat = await Chat.findOne({
        users: { $all: [req.user._id, friend._id] },
      });

      let lastMessage = "";
      let lastMessageTime = null;
      let unreadCount = 0;

      if (chat && chat.messages.length > 0) {
        const last = chat.messages[chat.messages.length - 1];

        if (!last.deleted) {
          lastMessage = last.text;
        } else {
          lastMessage = "This message was deleted";
        }

        lastMessageTime = last.createdAt;

        unreadCount = chat.messages.filter(
          (m) =>
            String(m.sender) !== String(req.user._id) && !m.seen && !m.deleted,
        ).length;
      }

      users.push({
        _id: friend._id,
        username: friend.username,
        avatar: friend.avatar || "",
        lastMessage,
        lastMessageTime,
        unreadCount,
      });
    }

    users.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;

      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// GET OR CREATE CHAT
// ===============================
exports.getOrCreateChat = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;

    let chat = await Chat.findOne({
      users: { $all: [myId, otherId] },
    }).populate([
      {
        path: "users",
        select: "username avatar",
      },
      {
        path: "messages.sender",
        select: "username avatar",
      },
      {
        path: "messages.sharedPost",
        populate: {
          path: "user",
          select: "username avatar",
        },
      },
    ]);

    if (!chat) {
      chat = await Chat.create({
        users: [myId, otherId],
        messages: [],
      });

      chat = await Chat.findById(chat._id).populate([
        {
          path: "users",
          select: "username avatar",
        },
        {
          path: "messages.sender",
          select: "username avatar",
        },
        {
          path: "messages.sharedPost",
          populate: {
            path: "user",
            select: "username avatar",
          },
        },
      ]);
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// ===============================
// SEND MESSAGE
// ===============================
exports.postMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    chat.messages.push({
      sender: req.user._id,
      text: text.trim(),
      seen: false,
      edited: false,
      deleted: false,
    });

    await chat.save();

    await chat.populate({
      path: `messages.${chat.messages.length - 1}.sender`,
      select: "username avatar",
    });

    const newMessage = chat.messages[chat.messages.length - 1];

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// MARK ALL MESSAGES AS SEEN
// ===============================
exports.markMessageSeen = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    let updated = false;

    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.user._id.toString() && !msg.seen) {
        msg.seen = true;
        updated = true;
      }
    });

    if (updated) {
      await chat.save();
    }

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// ===============================
// EDIT MESSAGE
// ===============================
exports.editMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const message = chat.messages.id(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (String(message.sender) !== String(req.user._id)) {
      return res.status(403).json({
        message: "You can edit only your own messages",
      });
    }

    message.text = text.trim();
    message.edited = true;

    await chat.save();

    await message.populate("sender", "username avatar");

    res.json(message);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// DELETE MESSAGE
// ===============================
exports.deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const message = chat.messages.id(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (String(message.sender) !== String(req.user._id)) {
      return res.status(403).json({
        message: "You can delete only your own messages",
      });
    }

    message.deleted = true;
    message.text = "This message was deleted";

    await chat.save();

    res.json({
      success: true,
      message: "Message deleted",
    });
  } catch (err) {
    console.error("POST MESSAGE ERROR:");
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
// ===============================
// SHARE POST
// ===============================
exports.sharePost = async (req, res) => {
  try {
    const { to, postId } = req.body;
    const from = req.user._id;

    // Find existing chat
    let chat = await Chat.findOne({
      users: { $all: [from, to] },
    });

    // Create chat if it doesn't exist
    if (!chat) {
      chat = await Chat.create({
        users: [from, to],
        messages: [],
      });
    }

    // Create shared message
    const message = {
      sender: from,
      text: "",
      type: "shared_post",
      sharedPost: postId,
      seen: false,
    };

    chat.messages.push(message);

    await chat.save();

    await chat.populate([
      {
        path: "messages.sender",
        select: "username avatar",
      },
      {
        path: "messages.sharedPost",
      },
    ]);

    const savedMessage = chat.messages[chat.messages.length - 1];

    res.json({
      success: true,
      chatId: chat._id,
      message: savedMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
