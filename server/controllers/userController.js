const User = require("../models/User");
const path = require("path");

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

// POST /api/users/avatar  (multer handles req.file)
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    user.avatar = req.file.path; // ✅ Cloudinary URL
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// GET /api/users/search?query=...
exports.searchUsers = async (req, res) => {
  const q = req.query.query || "";
  const users = await User.find({
    username: { $regex: q, $options: "i" },
  }).select("username avatar email");
  res.json(users);
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

  target.followers = target.followers.filter((f) => String(f) !== String(userId));
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
