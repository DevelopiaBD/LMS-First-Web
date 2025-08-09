import React from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sadia Rahman",
      role: "Student, Class 9",
      quote: "KnowledgeHut helped me understand math better than my school books. Highly recommended!",
    },
    {
      name: "Tanvir Hasan",
      role: "Parent of Class 6 Student",
      quote: "A safe and helpful platform for my son. He enjoys studying now!",
    },
    {
      name: "Raihan Ahmed",
      role: "Class 10",
      quote: "Their science videos and notes are very easy to follow. Loved it!",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonial-container">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="quote">“{t.quote}”</p>
              <div className="author">
                <span className="name">{t.name}</span>
                <span className="role">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
