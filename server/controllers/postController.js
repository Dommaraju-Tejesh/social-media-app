const Post = require("../models/Post");

// POST /api/posts (protected, multer)
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      user: req.user._id,
      text,
      image: imagePath,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/posts
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("user", "username avatar")
    .populate("comments.user", "username avatar")
    .sort({ createdAt: -1 });
  res.json(posts);
};

// GET /api/posts/user/:userId
exports.getUserPosts = async (req, res) => {
  const posts = await Post.find({ user: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(posts);
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (String(post.user) !== String(req.user._id))
    return res.status(403).json({ message: "Not allowed" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};

// POST /api/posts/:id/like
exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id;
  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => String(id) !== String(userId));
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res.json(post);
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ user: req.user._id, text });
  await post.save();

  res.json(post);
};
