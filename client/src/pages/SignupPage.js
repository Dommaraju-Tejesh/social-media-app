import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        return setError("Passwords do not match");
      }

      await api.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-4 border p-2 bg-light">Signup Here</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label">UserName</label>
          <input
            type="text"
            className="form-control mb-3"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control mb-3"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <label className="form-check-label">Agree to terms and conditions</label>
          </div>

          <button className="btn btn-success w-100">Signup</button>
        </form>

        <p className="mt-3 text-center">
          Already User? <a href="/login">Login In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
