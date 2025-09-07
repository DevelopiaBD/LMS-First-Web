import React, { useState } from 'react';
import "./AdminLayout.css"
import { NavLink, Outlet } from 'react-router-dom';

import play from "/svgs/play.svg"

const AdminLayout = () => {

  const [toggle, setToggle] = useState(false);




  return (
    <div className='AdminLayoutMainDiv'>

        <div className={toggle?"AdminNavbarDiv active":"AdminNavbarDiv"}>
            <div className="navTitleAndLogo">
                <h1 className='navLogo'>Courses</h1>
            </div>

            <div className="navLinksMainDiv">
                <NavLink className="navLinks" to="/dashboard" onClick={()=>setToggle(false)}>Dasboard</NavLink>
                <NavLink className="navLinks" to="courses" onClick={()=>setToggle(false)}>Course</NavLink>
                <NavLink className="navLinks" to="students" onClick={()=>setToggle(false)}>Student</NavLink>
                <NavLink className="navLinks" to="admin" onClick={()=>setToggle(false)}>Admin</NavLink>
                <NavLink className="navLinks" to="courses/controll" onClick={()=>setToggle(false)}>Course</NavLink>
                <NavLink className="navLinks" to="students" onClick={()=>setToggle(false)}>Student</NavLink>
            </div>

            <img 
            src={play} 
            alt="LMS Admin Toggle Nav" 
            className={toggle?'toggleNavButton active':'toggleNavButton'}
            onClick={()=>toggle? setToggle(false):setToggle(true)}
            />
        </div>



        <div className="AdminContensDiv">
            <Outlet/>
        </div>

    </div>
  )
}

export default AdminLayout