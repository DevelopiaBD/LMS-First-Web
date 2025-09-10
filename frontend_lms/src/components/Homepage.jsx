// src/components/Homepage.jsx
import React from "react";

import "./Homepage.css";
import HeroSection from "./sections/HeroSection/HeroSection";
import PopularCourses from "./sections/PopularCourses/PopularCourses";
import FeaturesBlock from "./sections/FeaturesBlock/FeaturesBlock";
import Testimonials from "./sections/Testimonials/Testimonials";
import FaqSection from "./sections/FaqSection/FaqSection";
import Newsletter from "./sections/Newsletter/Newsletter";
import Footer from "./sections/Footer/Footer";
import Navbar from "./sections/Navbar/Navbar";
import CourseCard from "./sections/CourseCard/CourseCard";
import EduMiniSlider from "./EduMiniSlider";
import EduImageSlider from "./EduMiniSlider";
import EducationalSlider from "./EduMiniSlider";
import TopSections from "./sections/TopSections/TopSections";


const Homepage = () => {
  return (
    <div className="HomeContainer">
      <Navbar/>
      <div className="coverImage">
      <HeroSection />
      </div>

      <div className="MainBlogsAndOthersContainer">
    <section className="popular-section">
      <div className="popular-container">
        <h2 className="popular-title">Popular Courses</h2>
        <PopularCourses />
      </div>
    </section>
        
      <TopSections/>
      <div className="eduImageSliderMainDiv">
        <EducationalSlider/>
      </div>
      {/* <CourseCard/> */}



      <FeaturesBlock />
      <Testimonials />
      <FaqSection/>
      <Newsletter/>
      <Footer />
      {/* 
      
  
       */}
      </div>
    </div>
  );
};

export default Homepage;
