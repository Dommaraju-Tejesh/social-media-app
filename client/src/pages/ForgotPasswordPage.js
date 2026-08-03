import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [verified, setVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (nickname.trim().toLowerCase() === "pulli") {
      setVerified(true);
    } else {
      alert("😏 Wrong answer!\n\nLooks like you're not from Pulli's gang.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
        answer: nickname,
        newPassword,
      });

      alert("🎉 " + res.data.message);

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed.");
    }
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="animated-bg"></div>

      <motion.div
        className="login-card"
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <h2
          className="brand-title"
          style={{
            marginTop: 0,
            textAlign: "center",
          }}
        >
          Pulli Media
        </h2>

        <p
          className="subtitle"
          style={{
            textAlign: "center",
          }}
        >
          Friend Verification
        </p>

        {!verified ? (
          <>
            <p
              style={{
                color: "#fff",
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              Only Pulli friends can reset the password.
            </p>

            <form onSubmit={handleVerify}>
              <div className="input-box">
                <FaEnvelope />

                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-box">
                <FaLock />

                <input
                  type="text"
                  placeholder="What's my nickname?"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </div>

              <button className="login-btn">
                Verify
                <FaArrowRight />
              </button>
            </form>
          </>
        ) : (
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="login-error"
              style={{
                background: "rgba(34,197,94,0.18)",
                color: "#ffffff",
                border: "1px solid rgba(34,197,94,.4)",
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              😂 Correct ra!
              <br />
              You're definitely from Pulli's gang.
            </motion.div>

            <form onSubmit={handleResetPassword}>
              <div className="input-box">
                <FaLock />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="input-box">
                <FaLock />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button className="login-btn">
                Reset Password
                <FaArrowRight />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
