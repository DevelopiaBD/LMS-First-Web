import { useState } from 'react'
import {Route, Routes} from "react-router-dom"
import './App.css'
import Homepage from './components/Homepage'
import SingleCoursePage from './components/sections/SingleCoursePage/SingleCoursePage'
import Navbar from './components/sections/Navbar/Navbar'
import Login from './components/sections/Login/Login'
import Registration from './components/sections/Registration/Registration'
import CourseFormPage from './components/CourseFormPage/CourseFormPage '
import { useApiContext } from '../Utils/ApiContext'
import PageFadeWrapper from './components/sections/PageFadeWrapper'
import AdminLayout from './components/ADMIN/AdminLayout/AdminLayout'
import AllCoursesEnrolled from './components/ADMIN/AllCoursesEnrolled/AllCoursesEnrolled'
import Dashboard from './components/ADMIN/Dashboard/Dashboard'
import CourseControlPage from './components/ADMIN/CourseControlPage/CourseControlPage'
import InstructorSingleCourse from './components/ADMIN/InstructorSingleCourse/InstructorSingleCourse'
import CourseSellingView from './components/sections/CourseSellingView/CourseSellingView'
import PaymentForm from './components/PaymentForm/PaymentForm'
import ProfilePage from './components/ADMIN/ProfilePage'

function App() {

  const {LoggedIn, user} = useApiContext();
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <PageFadeWrapper>
     <Routes>
        <Route path='/' element={<Homepage/>}/>
        {/* <Route path='/course/create' element={<CourseFormPage/>}/> */}
        {
        !!user?
        <></>
        :
        <>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registration' element={<Registration/>}/>
        </>
        }
        <Route path='/course/selling/:id' element={<CourseSellingView/>}/>
        <Route path='/course/:id' element={<SingleCoursePage/>}/>
        
        <Route path='course/purchase/:id' element={<PaymentForm/>}/>


        <Route path='/*' element={<Homepage/>}/>


{/* Admin Routes */}
        <Route path='/dashboard' element={<AdminLayout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='courses' element={<AllCoursesEnrolled/>}/>
          <Route path='course/:id' element={<InstructorSingleCourse/>}/>
          <Route path='courses/controll' element={<CourseControlPage/>}/>
          <Route path='profile' element={<ProfilePage/>}/>
          <Route path='*'/>


          {/* <Route index element={<AdminLayout/>}/> */}
        </Route>
      </Routes>
      </PageFadeWrapper>
    </>
  )
}

export default App
