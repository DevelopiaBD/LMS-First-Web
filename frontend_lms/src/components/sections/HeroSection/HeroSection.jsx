// src/components/HeroSection.jsx
import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">

      <div className="hero-Main-container">
        <div className="hero-container">
          <h1 className="hero-title">KnowledgeHut.Online</h1>
          <p className="hero-subtitle">Browse hundreds of expert-led courses designed for all levels. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa laudantium eligendi unde iusto expedita aperiam nostrum vel nam obcaecati vitae eum, magnam id necessitatibus voluptate iure nobis neque sunt iste.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Browse Courses</button>
            <button className="btn btn-outline">Join for Free</button>
          </div>

          <div className="searchArea">
            <input type="search" name="search" id="" placeholder="SEARCH COURSES HERE"/>
            <button type="submit">Search Now</button>
          </div>
        </div>


        <div className="hero-container-image">
          <img src="https://res.cloudinary.com/diknv6ocp/image/upload/v1750004016/ecommerce-products/bqh9lnxeeite8ssk85qc.webp" alt="" />
          <img src="https://res.cloudinary.com/diknv6ocp/image/upload/v1751114211/ecommerce-products/hpxgkzdprulnvuu3ajwa.webp" alt="" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
