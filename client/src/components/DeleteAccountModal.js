import React from "react";

const DeleteAccountModal = ({ open, onClose, onDelete }) => {
  if (!open) return null;

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
          width: "450px",
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#dc2626" }}>
          ⚠ Delete Account
        </h2>

        <p>
          This action is permanent.
        </p>

        <p>
          Your profile, posts, chats, likes and comments will be deleted forever.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#ddd",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#dc2626",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;