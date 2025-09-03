// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loaderWebp from "../assets/loader.webp";
import "./styles/LoginRegister.css";

const Login = () => {
  const { login } = useAuth(); // ✅ use login, not fetchProfile
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://path2placement-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // ✅ Save token + set profile directly
      const jwtToken = data.session?.access_token || data.token;
      login(jwtToken, data.user);

      navigate("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {loading && (
        <div className="loader-overlay">
          <img src={loaderWebp} alt="Loading..." className="loader-webp" />
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <p>
          Welcome, <span>sign in to continue</span>
        </p>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="toggleText">
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
