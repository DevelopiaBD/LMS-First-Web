import React, { useState } from "react";
import "./FaqSection.css";

const faqs = [
  {
    question: "What is this platform about?",
    answer: "This platform offers premium access to high-quality digital courses, tools, and materials."
  },
  {
    question: "How do I access premium content?",
    answer: "You need to create an account and purchase a plan to unlock all premium features."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 7-day money-back guarantee for all our plans."
  },
  {
    question: "Can I use it on mobile devices?",
    answer: "Absolutely! Our site is fully responsive and mobile-friendly."
  }
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">{faq.question}</div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
