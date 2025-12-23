import React, { useState } from "react";

const CommentSection = ({ post, onAddComment, onClose }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(post._id, text);
    setText("");
  };

  return (
    <div className="card shadow-sm p-3 mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">Comments</h5>
        <button className="btn btn-sm btn-outline-danger" onClick={onClose}>
          Close ✖
        </button>
      </div>

      <hr />

      {/* Comment List */}
      <div
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          paddingRight: "5px",
        }}
      >
        {post.comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          post.comments.map((c) => (
            <div key={c._id} className="mb-2">
              <strong>{c.user?.username || "User"}</strong>
              <p className="m-0" style={{ fontSize: "14px" }}>
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="d-flex mt-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
