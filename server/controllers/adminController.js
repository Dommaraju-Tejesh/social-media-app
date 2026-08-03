const User = require("../models/User");
const Post = require("../models/Post");
const Chat = require("../models/Chat");

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalChats = await Chat.countDocuments();

    const users = await User.find()
      .select("username email avatar createdAt isAdmin isBanned")
      .sort({ createdAt: -1 });

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalChats,
      },
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Ban User
exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Don't allow banning another admin
    if (user.isAdmin) {
      return res.status(400).json({
        message: "Admin account cannot be banned",
      });
    }

    user.isBanned = true;

    await user.save();

    res.json({
      message: "User banned successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Unban User
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    user.isBanned = false;

    await user.save();

    res.json({
      message: "User unbanned successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
