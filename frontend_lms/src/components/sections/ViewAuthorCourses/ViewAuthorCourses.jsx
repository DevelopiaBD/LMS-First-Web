import React, { useEffect } from 'react';
import "./ViewAuthorCourses.css"
import { UseDashBoardContextProvider } from '../../../../Utils/DashBoardContext';
import { NavLink } from 'react-router-dom';


const ViewAuthorCourses = () => {
  const {getInstructorCourses, instructorCourses} = UseDashBoardContextProvider();
  
  useEffect(()=>{
    getInstructorCourses()
  },[]);


  
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