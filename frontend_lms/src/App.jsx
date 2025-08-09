import { useState } from 'react'
import {Route, Routes} from "react-router-dom"
import './App.css'
import Homepage from './components/Homepage'
import SingleCoursePage from './components/sections/SingleCoursePage/SingleCoursePage'
import Navbar from './components/sections/Navbar/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
     <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/course/:id' element={<SingleCoursePage/>}/>
      </Routes>
    </>
  )
}

export default App
