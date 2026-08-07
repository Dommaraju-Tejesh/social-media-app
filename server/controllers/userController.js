const User = require("../models/User");
const Post = require("../models/Post");
const Chat = require("../models/Chat");
const path = require("path");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// GET /api/users/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile (update username / email)
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "social-media-avatars",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY AVATAR ERROR:");
            console.dir(error, { depth: null });
            return reject(error);
          }

          resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const user = await User.findById(req.user._id);

    user.avatar = result.secure_url;

    await user.save();

    res.json({
      avatar: result.secure_url,
    });
  } catch (err) {
    console.error("========== AVATAR ERROR ==========");
    console.error(err);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("==================================");

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const q = (req.query.query || "").trim();

    // If search box is empty, return empty array
    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      username: {
        $regex: q,
        $options: "i",
      },
    }).select("username avatar email");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/users/:id/follow
exports.followUser = async (req, res) => {
  const targetId = req.params.id;
  const userId = req.user._id;

  if (targetId === String(userId))
    return res.status(400).json({ message: "Cannot follow yourself" });

  const target = await User.findById(targetId);
  const user = await User.findById(userId);

  if (!target) return res.status(404).json({ message: "User not found" });

  if (!target.followers.includes(userId)) target.followers.push(userId);
  if (!user.following.includes(targetId)) user.following.push(targetId);

  await target.save();
  await user.save();

  res.json({ message: "Followed" });
};

// POST /api/users/:id/unfollow
exports.unfollowUser = async (req, res) => {
  const targetId = req.params.id;
  const userId = req.user._id;

  const target = await User.findById(targetId);
  const user = await User.findById(userId);

  if (!target) return res.status(404).json({ message: "User not found" });

  target.followers = target.followers.filter(
    (f) => String(f) !== String(userId),
  );
  user.following = user.following.filter((f) => String(f) !== String(targetId));

  await target.save();
  await user.save();

  res.json({ message: "Unfollowed" });
};

// GET /api/users/:id/profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("followers", "username avatar")
    .populate("following", "username avatar");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// DELETE /api/users/delete-account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all posts created by the user
    await Post.deleteMany({ user: userId });

    // Remove user from followers/following lists
    await User.updateMany(
      {},
      {
        $pull: {
          followers: userId,
          following: userId,
        },
      },
    );

    // Delete chats involving the user
    await Chat.deleteMany({
      users: userId,
    });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .populate("following", "username avatar followers")
      .populate("followers", "_id");

    const friends = currentUser.following.filter((user) =>
      user.followers.some(
        (follower) => follower._id.toString() === req.user._id.toString()
      )
    );

    res.json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};