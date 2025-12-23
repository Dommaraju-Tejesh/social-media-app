import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">

        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Social<span style={{ color: "#007bff" }}>Media</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {user ? (
              <>
                {/* Home */}
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/">
                    Home
                  </Link>
                </li>

                {/* Chat */}
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/chat">
                    Chat
                  </Link>
                </li>

                {/* Profile */}
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to={`/profile/${user._id}`}>
                    Profile
                  </Link>
                </li>

                {/* Avatar */}
                <li className="nav-item mx-3">
                  <Link to={`/profile/${user._id}`}>
                    <img
                      src={
                        user.avatar ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="profile"
                      className="rounded-circle"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "cover",
                        border: "2px solid #007bff",
                      }}
                    />
                  </Link>
                </li>

                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-dark btn-sm px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Login */}
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/login">
                    Login
                  </Link>
                </li>

                {/* Signup */}
                <li className="nav-item mx-2">
                  <Link className="nav-link fw-semibold" to="/signup">
                    Signup
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






