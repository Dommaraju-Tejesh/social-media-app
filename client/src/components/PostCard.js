import React from "react";

const PostCard = ({ post, onLike, onDelete, onOpenComments, currentUserId }) => {
  const isOwner = currentUserId === post.user._id;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">

        {/* ---------- USER HEADER ---------- */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={
              post.user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="user avatar"
            className="rounded-circle me-3"
            style={{ width: "45px", height: "45px", objectFit: "cover" }}
          />

          <div>
            <strong style={{ fontSize: "16px" }}>
              {post.user.username}
            </strong>
            <p className="text-muted m-0" style={{ fontSize: "12px" }}>
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ---------- POST TEXT ---------- */}
        <p style={{ fontSize: "15px" }}>{post.text}</p>

        {/* ---------- POST IMAGE ---------- */}
        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="img-fluid rounded mb-3"
            style={{
              width: "100%",
              maxHeight: "350px",
              objectFit: "cover",
            }}
          />
        )}

        {/* ---------- ACTION BUTTONS ---------- */}
        <div className="mt-2">
          {/* Like Button */}
          <button
            className="btn btn-outline-danger btn-sm me-2"
            onClick={() => onLike(post._id)}
          >
            ❤️ {post.likes.length}
          </button>

          {/* Comments Button */}
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={onOpenComments}
          >
            💬 {post.comments.length}
          </button>

          {/* Delete Button for Owner */}
          {isOwner && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(post._id)}
            >
              🗑 Delete
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PostCard;


