import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ post, onAddComment, onClose }) => {
  const { user } = useAuth();

  // -----------------------------
  // States
  // -----------------------------

  const [comments, setComments] = useState(post.comments || []);

  const [text, setText] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editingText, setEditingText] = useState("");

  const [deleteCommentId, setDeleteCommentId] = useState(null);

  // -----------------------------
  // Sync Comments
  // -----------------------------

  useEffect(() => {
    setComments(post.comments || []);
  }, [post]);

  // -----------------------------
  // Disable Background Scroll
  // -----------------------------

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // -----------------------------
  // Relative Time
  // -----------------------------

  const getRelativeTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";

    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    if (days === 1) return "Yesterday";

    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return new Date(date).toLocaleDateString();
  };

  // -----------------------------
  // Add Comment
  // -----------------------------

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post(`/posts/${post._id}/comments`, {
        text,
      });

      // Update popup instantly
      setComments(res.data.comments);

      // Keep parent in sync (optional)
      if (onAddComment) {
        onAddComment(post._id, text);
      }

      setText("");
    } catch (err) {
      alert("Unable to add comment.");
    }
  };

  // -----------------------------
  // Edit Comment
  // -----------------------------

  const startEditing = (comment) => {
    setEditingId(comment._id);

    setEditingText(comment.text);
  };

  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const res = await api.put(`/posts/${post._id}/comments/${editingId}`, {
        text: editingText,
      });

      console.log("Response:", res.data);

      setComments(res.data.comments);

      if (onAddComment) {
        await onAddComment();
      }

      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
      alert("Unable to edit comment.");
    }
  };

  // -----------------------------
  // Delete Comment
  // -----------------------------

  const confirmDelete = async () => {
    try {
      const res = await api.delete(
        `/posts/${post._id}/comments/${deleteCommentId}`,
      );

      setComments(res.data.comments);

      if (onAddComment) {
        await onAddComment();
      }

      setDeleteCommentId(null);
    } catch (err) {
      alert("Unable to delete comment.");
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white shadow-lg"
          style={{
            width: "95%",
            maxWidth: "560px",
            height: "75vh",
            borderRadius: "22px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="d-flex justify-content-between align-items-center px-4 py-3"
            style={{
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <h4 className="fw-bold m-0">💬 Comments</h4>

            <button
              onClick={onClose}
              className="btn btn-light rounded-circle"
              style={{
                width: "42px",
                height: "42px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Comments */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "#fafafa",
            }}
          >
            {comments.length === 0 ? (
              <div className="text-center text-muted mt-5">
                <h5>No comments yet</h5>
                <p>Start the conversation!</p>
              </div>
            ) : (
              comments.map((comment) => {
                const isOwner = comment.user?._id === user?._id;

                return (
                  <div key={comment._id} className="mb-3">
                    <div
                      className="bg-white shadow-sm"
                      style={{
                        borderRadius: "18px",
                        padding: "14px",
                      }}
                    >
                      <div className="d-flex">
                        <img
                          src={
                            comment.user?.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt=""
                          className="rounded-circle"
                          style={{
                            width: 42,
                            height: 42,
                            objectFit: "cover",
                            border: "2px solid #0d6efd",
                          }}
                        />

                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">
                                {comment.user?.username || "User"}
                              </div>

                              <small className="text-muted">
                                {getRelativeTime(comment.createdAt)}
                              </small>
                            </div>

                            {isOwner && (
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => startEditing(comment)}
                                >
                                  ✏
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    setDeleteCommentId(comment._id)
                                  }
                                >
                                  🗑
                                </button>
                              </div>
                            )}
                          </div>

                          {editingId === comment._id ? (
                            <>
                              <textarea
                                className="form-control mt-3"
                                rows={3}
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                              />

                              <div className="mt-3 d-flex justify-content-end">
                                <button
                                  className="btn btn-light me-2"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </button>

                                <button
                                  className="btn btn-primary"
                                  onClick={saveEdit}
                                >
                                  Save
                                </button>
                              </div>
                            </>
                          ) : (
                            <p
                              className="mt-2 mb-0"
                              style={{
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {comment.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            className="p-3"
            style={{
              borderTop: "1px solid #e9ecef",
              background: "#fff",
            }}
          >
            <div className="d-flex">
              <input
                className="form-control rounded-pill me-2"
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />

              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteCommentId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              width: "360px",
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <h4 className="fw-bold mb-3">Delete Comment?</h4>

            <p className="text-muted">This action cannot be undone.</p>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-light rounded-pill px-4"
                onClick={() => setDeleteCommentId(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger rounded-pill px-4"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentSection;
