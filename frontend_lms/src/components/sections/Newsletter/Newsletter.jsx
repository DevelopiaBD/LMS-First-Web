import React, { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add API call to save email
    if (email.trim() !== "") {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates, offers, and learning tips right in your inbox.</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="newsletter-form" noValidate>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </form>
        ) : (
          <p className="thankyou-msg">Thank you for subscribing!</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
