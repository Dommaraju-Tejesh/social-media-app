import React from "react";

const MediaViewer = ({ isOpen, mediaUrl, mediaType = "image", onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "90%",
          maxHeight: "90%",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-45px",
            right: "0",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "35px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {mediaType === "image" ? (
          <img
            src={mediaUrl}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "85vh",
              borderRadius: "10px",
            }}
          />
        ) : (
          <video
            src={mediaUrl}
            controls
            autoPlay
            style={{
              maxWidth: "100%",
              maxHeight: "85vh",
              borderRadius: "10px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MediaViewer;