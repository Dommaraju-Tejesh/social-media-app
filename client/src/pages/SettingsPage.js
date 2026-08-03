import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import DeleteAccountModal from "../components/DeleteAccountModal";


const SettingsPage = () => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/delete-account");

      logout();

      alert("Your account has been deleted successfully.");

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          fontWeight: "700",
        }}
      >
        ⚙️ Settings
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <h3>Account</h3>

        <hr />

        {user?.isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🛡 Admin Dashboard
          </button>
        )}

        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🗑 Delete Account
        </button>
        <DeleteAccountModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
