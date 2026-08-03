import React from "react";
import api from "../api";

const ShareModal = ({ open, onClose, friends, postId }) => {
  if (!open) return null;

  const handleShare = async (friendId) => {
    try {
      await api.post("/chats/share", {
        to: friendId,
        postId,
      });

      alert("Post shared successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to share post.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 20px 50px rgba(0,0,0,.2)",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          📤 Share Post
        </h3>

        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
          }}
        >
          {friends?.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>
              No friends found
            </p>
          ) : (
            friends?.map((friend) => (
              <div
                key={friend._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <img
                    src={
                      friend.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <div style={{ fontWeight: "600" }}>{friend.username}</div>

                    <small style={{ color: "#777" }}>
                      @{friend.username.toLowerCase()}
                    </small>
                  </div>
                </div>

                <button
                  onClick={() => handleShare(friend._id)}
                  style={{
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "8px 18px",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "20px",
            border: "none",
            padding: "12px",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
