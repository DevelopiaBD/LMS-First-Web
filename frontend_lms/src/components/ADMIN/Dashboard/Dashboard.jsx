import React from 'react';
import "./Dashboard.css"
import Calendar from '../CalenderView/CalenderView';
import CourseFormPage from '../../CourseFormPage/CourseFormPage ';
import ViewAuthorCourses from '../../sections/ViewAuthorCourses/ViewAuthorCourses';
import { UseDashBoardContextProvider } from '../../../../Utils/DashBoardContext';

const Dashboard = () => {
  


  return (
    <div className='DashboardMainDiv'>
      <div className="DashboardStartDIv">
        <div className="DashboardPart1 Dashboard">
          <h2 className='TTtypeHead'>Notification</h2>
          <div className="dash1divs dash1_1">
           <div className="notificationDiv">
            <p className="headOfNotify">Courses</p>
            <p className="NotifyP">3</p>
           </div>
           <div className="notificationDiv">
            <p className="headOfNotify">Courses</p>
            <p className="NotifyP">3</p>
           </div>
           <div className="notificationDiv">
            <p className="headOfNotify">Courses</p>
            <p className="NotifyP">3</p>
           </div>
           <div className="notificationDiv">
            <p className="headOfNotify">Courses</p>
            <p className="NotifyP">3</p>
           </div>

          </div>
          <div className="dash1divs dash1_2">
            <h2 className='TTtypeHead instructorcourseTT'> My Courses</h2>
            <ViewAuthorCourses/>
          </div>
          <div className="dash1divs dash1_3"></div>
        </div>


        <div className="DashboardPart2 Dashboard"></div>
      </div>





      <div className="calenderMainDiv">
        <Calendar/>
      </div>
      <CourseFormPage/>

      {/* <div className="shortDetailsDiv">
        <div className="shortDetails">Courses</div>
        <div className="shortDetails"></div>
        <div className="shortDetails"></div>
        <div className="shortDetails"></div>
        <div className="shortDetails"></div>
      </div> */}

    </div>
  )
}

export default Dashboard