import React, { useState } from "react";
import "./Navbar.css";
import { useApiContext } from "../../../../Utils/ApiContext";

const Navbar = () => {

  const {user, LogOutUser} = useApiContext()
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
          <a href="/course/create" className="nav-item">Create</a>
          {
          !!user?
          <>
          <a onClick={()=>{LogOutUser()}} className="nav-item btn-signup">Logout</a>
          <a href="/dashboard" className="nav-item btn-login">Dashboard</a>
          </>
          :
          <>
          <a href="/login" className="nav-item btn-login">Login</a>
          <a href="/registration" className="nav-item btn-signup">Register</a>
          </>
          }
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
