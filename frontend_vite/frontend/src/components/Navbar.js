import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { teacher, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">⌨️</span>
        <div>
          <span className="brand-name">Coders DnC</span>
          <span className="brand-sub">Attendance System</span>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          🏠 Home
        </Link>
        <Link to="/view" className={`nav-link ${isActive("/view") ? "active" : ""}`}>
          📊 View
        </Link>
        <Link to="/history" className={`nav-link ${isActive("/history") ? "active" : ""}`}>
          📅 History
        </Link>
        {isLoggedIn && (
          <Link to="/mark" className={`nav-link ${isActive("/mark") ? "active" : ""}`}>
            ✅ Mark Attendance
          </Link>
        )}
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <div className="nav-user">
            <span className="teacher-badge">👨‍🏫 {teacher?.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-auth-links">
            <Link to="/login" className="btn-nav-login">Login</Link>
            <Link to="/register" className="btn-nav-register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
