import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      // backend returns: { token, user }
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-4 border p-2 bg-light">Login Here</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control mb-4"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-success w-100">Login</button>
        </form>

        <p className="mt-3 text-center">
          New User? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
