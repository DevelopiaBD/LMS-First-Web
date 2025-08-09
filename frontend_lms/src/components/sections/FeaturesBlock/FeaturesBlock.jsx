// src/components/sections/FeaturesBlock.jsx
import React from "react";
import "./FeaturesBlock.css";

const FeaturesBlock = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title">Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Expert Instructors</h3>
            <p>Learn from industry leaders who bring real-world experience to the classroom.</p>
          </div>
          <div className="feature-card">
            <h3>Flexible Learning</h3>
            <p>Study anytime, anywhere with our mobile-friendly platform.</p>
          </div>
          <div className="feature-card">
            <h3>Certification</h3>
            <p>Earn certificates that add value to your resume and career growth.</p>
          </div>
          <div className="feature-card">
            <h3>Community Support</h3>
            <p>Join a vibrant community of learners and educators for peer learning.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBlock;
