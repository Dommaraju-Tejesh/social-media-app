import React, { useEffect, useRef, useState } from "react";
import MediaViewer from "./MediaViewer";
import ShareModal from "./ShareModal";


const PostCard = ({
  post,
  onLike,
  onDelete,
  onOpenComments,
  currentUserId,
  isMuted,
  setIsMuted,
  friends,
}) => {
  const isOwner = currentUserId === (post.user?._id || post.user);

  const [viewerOpen, setViewerOpen] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);

  // Video States

  const [showControls, setShowControls] = useState(false);

  const mediaUrl = post.media || post.image;
  const mediaType = post.mediaType || "image";

  const videoRef = useRef(null);

  // -------------------------
  // Relative Time
  // -------------------------

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

  // -------------------------
  // Video Auto Play
  // -------------------------

  useEffect(() => {
    if (mediaType !== "video") return;

    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      },
      {
        threshold: 0.7,
      },
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [mediaType]);

  // -------------------------
  // Delete
  // -------------------------

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(post._id);
  };

  return (
    <>
      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          transition: "0.25s ease",
        }}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <img
                src={
                  post.user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="rounded-circle"
                style={{
                  width: 52,
                  height: 52,
                  objectFit: "cover",
                  border: "2px solid #0d6efd",
                }}
              />

              <div className="ms-3">
                <h6 className="fw-bold mb-0">{post.user.username}</h6>

                <small className="text-muted">
                  {getRelativeTime(post.createdAt)}
                </small>
              </div>
            </div>
          </div>

          {/* Caption */}

          {post.text && (
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              {post.text}
            </p>
          )}

          {/* Image */}

          {mediaUrl && mediaType === "image" && (
            <img
              src={mediaUrl}
              alt="post"
              onClick={() => setViewerOpen(true)}
              style={{
                width: "100%",
                maxHeight: "650px",
                objectFit: "contain",
                borderRadius: "14px",
                cursor: "pointer",
                background: "#f8f9fa",
              }}
            />
          )}

          {/* Video */}

          {mediaUrl && mediaType === "video" && (
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "14px",
                background: "#000",
              }}
            >
              <video
                ref={videoRef}
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                controls={showControls}
                onClick={() => setShowControls(true)}
                style={{
                  width: "100%",
                  maxHeight: "650px",
                  cursor: "pointer",
                }}
              >
                <source src={mediaUrl} type="video/mp4" />
              </video>

              <button
                onClick={() => {
                  if (!videoRef.current) return;

                  const nextMuted = !isMuted;

                  setIsMuted(nextMuted);

                  videoRef.current.muted = nextMuted;
                }}
                style={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,.55)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
          )}

          <hr className="my-4" />

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button
              className="btn btn-light rounded-pill px-4"
              onClick={() => onLike(post._id)}
            >
              ❤️ {post.likes.length}
            </button>

            <button
              className="btn btn-light rounded-pill px-4"
              onClick={onOpenComments}
            >
              💬 {post.comments.length}
            </button>

            <button
              className="btn btn-light rounded-pill px-4"
              onClick={() => setShowShareModal(true)}
            >
              📤 Share
            </button>

            {isOwner && (
              <button
                className="btn btn-danger rounded-pill px-4"
                onClick={handleDeleteClick}
              >
                🗑 Delete
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Image Viewer */}
      {mediaType === "image" && (
        <MediaViewer
          isOpen={viewerOpen}
          mediaUrl={mediaUrl}
          mediaType="image"
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "380px",
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
          >
            <h4 className="fw-bold mb-3">Delete Post?</h4>

            <p className="text-muted">This action cannot be undone.</p>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-light rounded-pill px-4"
                onClick={() => setShowDeleteModal(false)}
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
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        friends={friends}
        postId={post._id}
      />
    </>
  );
};

export default PostCard;
