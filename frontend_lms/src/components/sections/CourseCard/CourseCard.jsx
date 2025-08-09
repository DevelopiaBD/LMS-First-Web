


import React from 'react';
import "./CourseCard.css";
import img1 from "../../../../public/images/THUMB12.jpg";
import img2 from "../../../../public/images/thumb14.jpg";
import img3 from "../../../../public/images/thumb16.jpg";



const courseData = [
  {
    id: 1,
    image: img1,
    title: "Complete HTML CSS Course for Beginners in Bangla with Examples and Projects",
    instructor: "Muhammad Abir",
    certificate: "Yes",
    price: "1000",
    detailsLink: "/course/html-css",
  },
  {
    id: 2,
    image: img2,
    title: "Modern JavaScript Mastery with Projects",
    instructor: "Tanjim Khan",
    certificate: "Yes",
    price: "1200",
    detailsLink: "/course/javascript",
  },
  {
    id: 3,
    image: img3,
    title: "React JS Full Course with Tailwind in Bangla",
    instructor: "Rifat Hossain",
    certificate: "No",
    price: "0",
    detailsLink: "/course/react-js",
  },
  {
    id: 3,
    image: img3,
    title: "React JS Full Course with Tailwind in Bangla",
    instructor: "Rifat Hossain",
    certificate: "No",
    price: "0",
    detailsLink: "/course/react-js",
  },
  {
    id: 3,
    image: img3,
    title: "React JS Full Course with Tailwind in Bangla",
    instructor: "Rifat Hossain",
    certificate: "No",
    price: "0",
    detailsLink: "/course/react-js",
  },
];

const CourseCard = () => {
  return (
    <div className='CourseCardContainer'>
      {courseData.map(course => (
        <div className="CourseCard" key={course.id}>
          <div className="CourseImg">
            <img src={course.image} alt={course.title} />
          </div>

          <p className="CourseTitle">{course.title}</p>

          <div className="CourseDesc">
            <div className="CourseInstructor">
              <p className="instructorName sameInsDiv">
                <span>{course.instructor}</span>
                <span>Instructor</span>
              </p>
              <p className="Certification sameInsDiv">
                <span>Certificate</span>
                <span>{course.certificate}</span>
              </p>
            </div>

            <div className="CourseDetails sameInsDiv">
              <a href={course.detailsLink}>Details</a>
              <p className="price">{course.price > 0? `${course.price}৳` : "Free"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseCard;
