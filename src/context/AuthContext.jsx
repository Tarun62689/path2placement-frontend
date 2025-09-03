// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);

  // Fetch profile if needed
  const fetchProfile = async () => {
    setLoading(true);
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://path2placement-backend.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Login (store token + set profile from response)
  const login = (jwtToken, userData) => {
    localStorage.setItem("authToken", jwtToken);
    setToken(jwtToken);
    setProfile(userData); // ✅ directly set profile so UI updates instantly
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setProfile(null);
  };

  useEffect(() => {
    if (token) fetchProfile();
    else setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ profile, token, login, logout, loading, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
