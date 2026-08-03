import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthFlow } from "../context/AuthFlowContext";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

import introVideo from "../assets/videos/intro.mp4";
import outroVideo from "../assets/videos/outro.mp4";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { introPlayed, setIntroPlayed } = useAuthFlow();

  // Screen States
  const [showIntro, setShowIntro] = useState(!introPlayed);
  const [showLogin, setShowLogin] = useState(introPlayed);
  const [showOutro, setShowOutro] = useState(false);

  // Animation States
  const [fadeIntro, setFadeIntro] = useState(false);
  const [fadeLogin, setFadeLogin] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIntroEnd = () => {
    setFadeIntro(true);

    setTimeout(() => {
      setIntroPlayed(true); // Remember intro has already played
      setShowIntro(false);

      setTimeout(() => {
        setShowLogin(true);
      }, 300);
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      login(res.data.user, res.data.token);

      // If account is banned
      if (res.data.user.isBanned) {
        navigate("/banned");
        return;
      }

      // Fade Login Card
      setFadeLogin(true);

      // Wait before showing outro
      setTimeout(() => {
        setShowLogin(false);
        setShowOutro(true);
      }, 700);
    } catch (err) {
      setError("Invalid email or password.");

      setLoading(false);
    }
  };

  const handleOutroEnd = () => {
    setShowOutro(false);
    navigate("/");
  };

  return (
    <>
      {/* ===========================
            INTRO VIDEO
      ============================ */}

      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: fadeIntro ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              overflow: "hidden",
              background: "#000",
            }}
          >
            <video
              autoPlay
              muted
              playsInline
              onEnded={handleIntroEnd}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={introVideo} type="video/mp4" />
            </video>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: fadeIntro ? 1 : 0,
              }}
              transition={{
                duration: 0.6,
              }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle,#3b82f6 0%,rgba(0,0,0,.96) 72%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* ===========================
            LOGIN SCREEN
      ============================ */}

      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="login-page"
            initial={{ opacity: 0 }}
            animate={{
              opacity: fadeLogin ? 0 : 1,
            }}
            transition={{
              duration: 0.7,
            }}
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
                opacity: fadeLogin ? 0 : 1,
                y: fadeLogin ? -20 : 0,
                scale: fadeLogin ? 0.95 : 1,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <h2
                className="brand-title"
                style={{
                  textAlign: "center",
                  marginTop: 0,
                }}
              >
                Pulli Media
              </h2>

              <p
                className="subtitle"
                style={{
                  textAlign: "center",
                  marginBottom: 30,
                }}
              >
                Where friends share laughs, funny moments, and unforgettable
                memories.
              </p>

              {error && <div className="login-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="input-box">
                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="input-box">
                  <FaLock />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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

                <button className="login-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner
                        className="spin-icon"
                        style={{
                          marginRight: "10px",
                        }}
                      />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Login
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </form>

              <div className="login-links">
                <Link to="/forgot-password">Forgot Password?</Link>

                <p>
                  New here?
                  <Link to="/signup"> Register</Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ===========================
            OUTRO VIDEO
      ============================ */}

      <AnimatePresence>
        {showOutro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              overflow: "hidden",
              background: "#000",
            }}
          >
            <video
              autoPlay
              muted
              playsInline
              onEnded={handleOutroEnd}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={outroVideo} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginPage;
