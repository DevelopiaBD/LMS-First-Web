// src/components/PopularCourses.jsx
import React from "react";
import "./PopularCourses.css";

const courses = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    instructor: "John Doe",
    price: "$49.99",
    image: "https://res.cloudinary.com/diknv6ocp/image/upload/v1753510710/ecommerce-products/odkssykiepn01ysj7zs7.webp",
  },
  {
    id: 2,
    title: "Mastering React",
    instructor: "Jane Smith",
    price: "Free",
    image: "https://res.cloudinary.com/diknv6ocp/image/upload/v1751793790/ecommerce-products/nzcw26fujagetalcpsjb.webp"
,
  },
  {
    id: 3,
    title: "UI/UX Design Basics",
    instructor: "Emily Brown",
    price: "$29.99",
    image: "https://res.cloudinary.com/diknv6ocp/image/upload/v1751114211/ecommerce-products/hpxgkzdprulnvuu3ajwa.webp",
  },
  {
    id: 4,
    title: "Python for Beginners",
    instructor: "Mike Johnson",
    price: "$19.99",
    image: "https://res.cloudinary.com/diknv6ocp/image/upload/v1750004016/ecommerce-products/bqh9lnxeeite8ssk85qc.webp",
  },
];

const PopularCourses = () => {
  return (
    <section className="popular-section">
      <div className="popular-container">
        <h2 className="popular-title">Popular Courses</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <img src={course.image} alt={course.title} className="course-img" />
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">By {course.instructor}</p>
                <p className="course-price">{course.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;
