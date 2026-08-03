import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const BannedPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "550px",
          width: "100%",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
        }}
      >
        <div style={{ fontSize: "70px" }}>🚫</div>

        <h1
          style={{
            color: "#dc2626",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Account Banned
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#555",
            lineHeight: "1.7",
          }}
        >
          Your Pulli Media account has been banned by the administrator.
        </p>

        <p
          style={{
            color: "#777",
            marginTop: "15px",
          }}
        >
          If your account is restored, you will automatically be redirected to
          the login page.
        </p>
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          style={{
            marginTop: "30px",
            padding: "12px 30px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default BannedPage;
