import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthFlow } from "../context/AuthFlowContext";

import {
  FaHome,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaPaw,
  FaBars,
  FaTimes,
  FaCog,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { setIntroPlayed } = useAuthFlow();

  const navigate = useNavigate();
  const location = useLocation();

  // React controlled mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();

    setIntroPlayed(false);

    logout();

    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    color: active ? "#0d6efd" : "#343a40",
    transition: "0.25s",
  });

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        background: "#fff",
        boxShadow: "0 4px 18px rgba(0,0,0,.08)",
        padding: "12px 0",
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="navbar-brand fw-bold d-flex align-items-center"
          style={{
            gap: "10px",
            fontSize: "1.6rem",
            textDecoration: "none",
            color: "#212529",
          }}
        >
          <FaPaw color="#0d6efd" size={28} />

          <span>
            <span style={{ color: "#0d6efd" }}>Pulli</span> Media
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Menu */}
        <div className={`navbar-collapse ${menuOpen ? "show" : "collapse"}`}>
          <ul
            className="navbar-nav ms-auto align-items-center"
            style={{
              gap: "14px",
            }}
          >
            {user ? (
              <>
                {/* Home */}
                <li className="nav-item">
                  <Link
                    to="/"
                    onClick={closeMenu}
                    className="nav-link"
                    style={linkStyle(isActive("/"))}
                  >
                    <FaHome />
                    Home
                  </Link>
                </li>

                {/* Chat */}
                <li className="nav-item">
                  <Link
                    to="/chat"
                    onClick={closeMenu}
                    className="nav-link"
                    style={linkStyle(isActive("/chat"))}
                  >
                    <FaComments />
                    Chat
                  </Link>
                </li>

                {/* Profile */}
                <li className="nav-item">
                  <Link
                    to={`/profile/${user._id}`}
                    onClick={closeMenu}
                    className="nav-link"
                    style={linkStyle(location.pathname.includes("/profile"))}
                  >
                    <FaUser />
                    Profile
                  </Link>
                </li>

              

                {/* Settings */}
                <li className="nav-item">
                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className="nav-link"
                    style={linkStyle(isActive("/settings"))}
                  >
                    <FaCog />
                    Settings
                  </Link>
                </li>

                {/* Logout */}
                <li className="nav-item ms-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary rounded-pill d-flex align-items-center"
                    style={{
                      gap: "8px",
                      padding: "8px 18px",
                    }}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Login */}
                <li className="nav-item">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="btn rounded-pill"
                    style={{
                      border: "2px solid #0d6efd",
                      color: "#0d6efd",
                      fontWeight: 600,
                      padding: "8px 24px",
                    }}
                  >
                    Login
                  </Link>
                </li>

                {/* Register */}
                <li className="nav-item">
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="btn btn-primary rounded-pill"
                    style={{
                      fontWeight: 600,
                      padding: "8px 24px",
                    }}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
