import React from "react";

const UploadProgressModal = ({ show, progress, message }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>
          🐯 Pulli Media
        </h2>

        <h5>{message}</h5>

        <div
          style={{
            marginTop: "25px",
            width: "100%",
            height: "12px",
            background: "#ddd",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#2563eb",
              transition: "0.3s",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {progress}%
        </div>

        <p
          style={{
            marginTop: "20px",
            color: "#666",
          }}
        >
          Please don't close this page...
        </p>
      </div>
    </div>
  );
};

export default UploadProgressModal;