import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>KnowledgeHut</h3>
          <p>
            Empowering learners with quality education anytime, anywhere.
          </p>
        </div>
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h4>Contact</h4>
          <p>Email: support@knowledgehut.com</p>
          <p>Phone: +880 1234 567890</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} KnowledgeHut. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
