import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/Profile.css";

const Profile = () => {
  const { profile, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <p>No profile found. Please log in.</p>
      </div>
    );
  }

  const nameInitial = profile.profile?.name
    ? profile.profile.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{nameInitial}</div>
          <h2>
            {profile.profile?.name || profile.user?.email || "User"}
          </h2>
        </div>

        <div className="profile-details">
          <p><span>Email:</span> {profile.user?.email}</p>
          <p><span>Phone:</span> {profile.profile?.phone || "Not provided"}</p>
          <p><span>Role:</span> {profile.profile?.role || "Student"}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
