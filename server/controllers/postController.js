const Post = require("../models/Post");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    let media = "";
    let mediaType = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "social-media-posts",
            resource_type: req.file.mimetype.startsWith("video/")
              ? "video"
              : "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      media = result.secure_url;
      mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    const post = await Post.create({
      user: req.user._id,
      text,
      media,
      mediaType,
      image: mediaType === "image" ? media : "",
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("========== CREATE POST ERROR ==========");
    console.error(err);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("=======================================");

    res.status(500).json({
      message: err.message,
    });
  }
};

// GET /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/posts/user/:userId
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.user) !== String(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/posts/:id/like
exports.toggleLike = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    await post.populate("comments.user", "username avatar");

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/posts/:postId/comments/:commentId
exports.editComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const commentUserId = comment.user._id
      ? comment.user._id.toString()
      : comment.user.toString();

    if (commentUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.text = text;

    await post.save();
    await post.populate("comments.user", "username avatar");

    res.json({
      comments: post.comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/posts/:postId/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (String(comment.user) !== String(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    comment.deleteOne();

    await post.save();
    await post.populate("comments.user", "username avatar");

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
