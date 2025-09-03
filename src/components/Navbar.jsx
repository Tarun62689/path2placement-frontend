import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";
import { FaFileAlt, FaUserCircle, FaCode, FaBars, FaTimes, FaTachometerAlt } from "react-icons/fa"; // ✅ added Dashboard icon
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const { profile, loading } = useAuth();

  const displayName =
    profile?.profile?.fullName ||
    profile?.profile?.name ||
    profile?.user?.email ||
    "Profile";

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-brand">
          <img src="/viteLogo.png" alt="Logo" className="logo-image" />
          <Link to="/" className="navbar-logo">
            Path2Placement
          </Link>
        </div>

        {/* Hamburger toggle */}
        <div className="hamburger-menu" onClick={toggleMenu}>
          {isOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
        </div>

        {/* Desktop navigation */}
        <ul className="navbar-links">
          <li>
            <Link to="/" onClick={closeMenu}>
              <FaCode className="icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={closeMenu}>
              <FaTachometerAlt className="icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/resume-analyzer">
              <FaFileAlt className="icon" /> Resume Analyzer
            </Link>
          </li>
        </ul>

        {/* Auth button */}
        <div className="navbar-auth">
          {loading ? (
            <span>Loading...</span>
          ) : profile ? (
            <Link to="/account">
              <button className="btn blocks">
                <FaUserCircle className="icon" /> {displayName}
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="btn blocks">Login</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu modal */}
      <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              Path2Placement
            </Link>
            <div className="modal-close-icon" onClick={toggleMenu}>
              <FaTimes />
            </div>
          </div>

          <ul className="navbar-links">
            <li>
              <Link to="/" onClick={closeMenu}>
                <FaCode className="icon" /> Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={closeMenu}>
                <FaTachometerAlt className="icon" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/resume-analyzer" onClick={closeMenu}>
                <FaFileAlt className="icon" /> Resume Analyzer
              </Link>
            </li>
          </ul>

          <div className="navbar-auth">
            {loading ? (
              <span>Loading...</span>
            ) : profile ? (
              <Link to="/account" onClick={closeMenu}>
                <button className="btn blocks">
                  <FaUserCircle className="icon" /> {displayName}
                </button>
              </Link>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <button className="btn blocks">Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
