import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">KnowledgeHut</a>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${menuOpen ? "open" : ""}`}></span>
        </button>

        <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <a href="/" className="nav-item">Home</a>
          <a href="/courses" className="nav-item">Courses</a>
          <a href="/about" className="nav-item">About Us</a>
          <a href="/contact" className="nav-item">Contact</a>
          <a href="/login" className="nav-item btn-login">Login</a>
          <a href="/signup" className="nav-item btn-signup">Sign Up</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
