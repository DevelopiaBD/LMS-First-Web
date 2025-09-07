import React from 'react';
import "./CourseCard.css";

import { API } from '../../../../Utils/APi_Dummy';
import { useApiContext } from '../../../../Utils/ApiContext';



const CourseCard = () => {

  const {courseData, ApprovedCourseData} = useApiContext();

//   courseData = {
//   _id: "",
//   title: "",
//   description: "",
//   category: "",
//   level: "",
//   price: "",
//   thumbnail: "",
//   isApproved: "",
//   lectures: [],
//   createdAt: "",
//   __v: ""
// };



console.log(ApprovedCourseData);

  
  return (
    <div className='CourseCardContainer'>

      {ApprovedCourseData.length > 0 ?
      
    <h1>"No course Active"</h1>
    :  
    ApprovedCourseData.map((course, i) => (
        <div className="CourseCard" key={i}>
          <div className="CourseImg">
            <img src={course.thumbnail} alt={course.title} />
          </div>

          <p className="CourseTitle">{course.title}</p>

          <div className="CourseDesc">
            <div className="CourseInstructor">
              <p className="instructorName sameInsDiv">
                 <span>{course?.instructor?.name || "no"}</span>
                <span>Instructor</span>
              </p>
              <p className="Certification sameInsDiv">
                <span>Certificate</span>
                <span>{course.certificate}</span>
              </p>
            </div>

            <div className="CourseDetails sameInsDiv">
              <a href={`/course/selling/${course._id}`} >Details</a>
              <p className="price">{course.price > 0? `${course.price}৳` : "Free"}</p>
            </div>
          </div>
        </div>
      ))
    
    }
    </div>
  );
}

export default CourseCard;
