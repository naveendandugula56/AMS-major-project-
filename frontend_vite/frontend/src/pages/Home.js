import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isLoggedIn, teacher } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-badge">⌨️ DnC Club</div>
        <h1 className="hero-title">
          Attendance
          <br />
          <span className="accent">Management</span>
        </h1>
        <p className="hero-sub">
          Track attendance for DnC Basic, DnC Advanced, and 2nd Year students — all in one place.
        </p>

        <div className="hero-actions">
          <Link to="/view" className="btn-primary">📊 View Attendance</Link>
          <Link to="/history" className="btn-secondary">📅 History</Link>
          {isLoggedIn && (
            <Link to="/mark" className="btn-accent">✅ Mark Attendance</Link>
          )}
        </div>
      </div>

      <div className="cards-section">
        <div className="class-card">
          <div className="class-icon">🟢</div>
          <h3>DnC Basic</h3>
          <p>10 Students</p>
          <Link to="/view?class=DnC Basic">View →</Link>
        </div>
        <div className="class-card">
          <div className="class-icon">🔵</div>
          <h3>DnC Advanced</h3>
          <p>10 Students</p>
          <Link to="/view?class=DnC Adv">View →</Link>
        </div>
        <div className="class-card">
          <div className="class-icon">🟣</div>
          <h3>2nd Years</h3>
          <p>10 Students</p>
          <Link to="/view?class=2nd Years">View →</Link>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="teacher-cta">
          <p>Are you a teacher?</p>
          <div>
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Create Account</Link>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="teacher-cta">
          <p>Welcome back, <strong>{teacher.name}</strong>! Ready to mark attendance?</p>
          <Link to="/mark" className="btn-primary">Mark Attendance →</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
