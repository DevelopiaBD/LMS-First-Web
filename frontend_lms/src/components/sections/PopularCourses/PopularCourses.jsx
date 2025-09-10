// src/components/PopularCourses.jsx
import React from "react";
import "./PopularCourses.css";
import { useApiContext } from "../../../../Utils/ApiContext";




const PopularCourses = () => {
  const {courseData, ApprovedCourseData} = useApiContext();


  return (
    // <section className="popular-section">
    //   <div className="popular-container">
    //     <h2 className="popular-title">Popular Courses</h2>
        <div className="course-grid">
          {
            // selling
          ApprovedCourseData.length===0?
          <h2>No Courses Active</h2>
          :
          ApprovedCourseData.map((course) => (
            <a href={`/course/selling/${course._id}`} className="course-card" key={course._id}>
              <img src={course.thumbnail} alt={course.title} className="course-img" />
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">{course.instructor?.name || "No Name"}</p>
                <p className="course-price">{course.price}৳</p>
              </div>
            </a>
          ))}
        </div>
    //   </div>
    // </section>
  );
};

export default PopularCourses;
