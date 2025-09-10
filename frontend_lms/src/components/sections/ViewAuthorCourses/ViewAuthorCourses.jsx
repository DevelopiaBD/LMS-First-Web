import React, { useEffect } from 'react';
import "./ViewAuthorCourses.css"
import { UseDashBoardContextProvider } from '../../../../Utils/DashBoardContext';
import { NavLink } from 'react-router-dom';
import { useApiContext } from '../../../../Utils/ApiContext';


const ViewAuthorCourses = () => {
  const {getInstructorCourses, instructorCourses, enrolledCourses, getIStudentEnrolledCourses} = UseDashBoardContextProvider();
  const {user}= useApiContext()
  
  useEffect(()=>{
    getInstructorCourses();
    console.log(user);
    
  },[]);



  if(user?.role==="student"){

    useEffect(()=>{
      getIStudentEnrolledCourses()
      console.log(enrolledCourses);

    },[])



    
  return (
    <div className='ViewAuthorCourses'>
        {/* <div className="ViewAuthorCoursesMain"> */}
            {
                enrolledCourses && enrolledCourses.map((data, i)=>{

                  const {course, completed} = data;
          
                  return <NavLink className="coursesCard" key={i} to={`/course/${course?._id}`}>
                        <div className="imageDiv">
                            <img src={course?.thumbnail} alt={course?.title} />
                        </div>
                        <div className="statusDiv">
                            <p className="title">{course?.title}</p>
                            <span className='activeStatus'>{completed}%</span>
                        </div>

                    </NavLink>
                })
            }
        {/* </div> */}
    </div>
  )
  }
  




  console.log(instructorCourses);
  

  return (
    <div className='ViewAuthorCourses'>
        {/* <div className="ViewAuthorCoursesMain"> */}
            {
                instructorCourses && instructorCourses.map((courses, i)=>{
                  return <NavLink className="coursesCard" key={i} to={`course/${courses._id}`}>
                        <div className="imageDiv">
                            <img src={courses.thumbnail} alt={courses.title} />
                        </div>
                        <div className="statusDiv">
                            <span className='activeStatus'>{courses.isApproved? "o Active": "No x.."}</span>
                            <p className="pricing">{courses.category}</p>
                        </div>

                    </NavLink>
                })
            }
        {/* </div> */}
    </div>
  )
}

export default ViewAuthorCourses