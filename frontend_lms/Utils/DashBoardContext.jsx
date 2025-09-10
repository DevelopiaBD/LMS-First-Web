import React, { useReducer } from 'react'
import { useContext } from 'react';
import { createContext } from 'react'
import { useApiContext } from './ApiContext';
import { useState } from 'react';
import { useEffect } from 'react';
import reducerDashboardFN from './reducerDashboardFN';


const DBDContext = createContext();

let initialValue = {
    isLoading: false,
    isError: false,
}

const DashBoardContextProvider = ({children}) => {
   const {API_BASE, user, haveToken, Authorization} = useApiContext();

   const [token, setToken] = useState(null)
   const [enrolledVerified, setEnrolledVerified] = useState(false)
   const [instructorCourses, setInstructorCourses] = useState([]);

   const [enrolledCourses, setEnrolledCourses] = useState([]);

   const [loadingFormLecture, setLoadingFormLecture] = useState(false)
   const [errorSubmit, setErrorSubmit] = useState(false)

   console.log(token);

 useEffect(() => {
        const ab = localStorage.getItem("authToken");
        if (ab) {
            setToken(ab);
        } else {
            setToken(null);
        }

    }, [user]);


// Reducer..............

    const [state, dispatch] = useReducer(reducerDashboardFN, initialValue);

// Reducer..............







    const VerifyCourseEnroll = async(id)=>{
        const tt = localStorage.getItem("authToken")
        if(!tt){
            return console.log("Not Login");
            
        }

        try {
            const res = await fetch(`${API_BASE}/auth/${id}/verify`,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tt}`, // Capital A দিয়ে
            },

            });
            const data = await res.json();

            if(!res.ok){
                console.log(data);
                return
            }

            setEnrolledVerified(true)
            console.log("Enrolled Message:" + data.verify);
            
        } catch (error) {
            console.log(error.message);
            
        }
    }






// Create Course.................
const createCourse = async (formdata, id) => {
  const tt = localStorage.getItem("authToken");
  if (!tt) {
    console.log("NO Token! Login First");
    return;
  }

  try {
    const url = id
      ? `${API_BASE}/courses/update/${id}`
      : `${API_BASE}/courses/create`;

    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: {
        "Authorization": `Bearer ${tt}`, 
        // ❌ don’t add Content-Type manually when sending FormData
      },
      body: formdata, // ✅ send FormData directly
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Server error:", data.message || data.error);
      return;
    }

    console.log("Success:", data);
    getInstructorCourses()
    alert(id?"Course Updated":"Course Created")
    return data;
  } catch (error) {
    console.log("Fetch error:", error.message);
  }
};





const createLecture = async (formdata, id)=>{

    setLoadingFormLecture(true);


    console.log(formdata);

    const tt = localStorage.getItem("authToken");

    if (!tt) {
    console.log("NO Token! Login First");
    return;
    }



    try {


    if(id){
        const res = await fetch(`${API_BASE}/lectures/update/${id}`, {
            method: "PUT",
            headers:{
                "Authorization":`Bearer ${tt}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify(formdata)
        });

        if(!res.ok){
            setLoadingFormLecture(false)
            return false
        }
        const data = await res.json();
        console.log(data, res);
        return true
        }
        



        const res = await fetch(`${API_BASE}/lectures/create`, {
            method: "POST",
            headers:{"Authorization":`Bearer ${tt}`},
            body: formdata
        });


        if(!res.ok){return false}
        const data = await res.json();
        console.log(data, res);
        return true
        

    } catch (error) {
        console.log(error.message);
        return false
        
    }
}






const deleteInstLect = async(id)=>{

     const tt = localStorage.getItem("authToken");

    if (!tt) {
    console.log("NO Token! Login First");
    return;
    }


    try {
        
        const res = await fetch(`${API_BASE}/lectures/delete/${id}`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${tt}`
            }
        });

        if(!res.ok){
            console.log(res);
            return false;
        }

        const data = await res.json();
        console.log(data);
        
        return true;


    } catch (error) {
        console.log(error.message);
        return false
        
    }
}


// Create Course.................






    const getInstructorLectures = async(lectureId, courseId)=>{

        const tt = localStorage.getItem("authToken");
        if(!tt) return console.log("NO Tokem For Instructor");
        // console.log("jksdjksdvjksdvdv");
        
        // return
        
        try {
            const res = await fetch(`${API_BASE}/lectures/${lectureId}/instructor/${courseId}`, {
                method:"GET",
                headers:{
                    // "Content-Type":"application/json",
                    "Authorization":`Bearer ${tt}`
,
                }
            })

            if(!res.ok) return console.log(res);
            

            const data = await res.json();
            // setPlayedVideoInstructor(data.signedUrl);
            return data

            
        } catch (error) {
            console.log(error.message);
            
        }
    }






    const getIStudentEnrolledCourses = async()=>{

        const tt = localStorage.getItem("authToken");
        if(!tt) return console.log("NO Tokem For Instructor");
        
        try {
            const res = await fetch(`${API_BASE}/courses/user`, {
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${tt}`
                }
            })

            if(!res.ok) return console.log(res);
            

            const data = await res.json();
            console.log(data);
            setEnrolledCourses(data.enrolledCourses)
            
        } catch (error) {
            console.log(error.message);
            
        }
    }



    const getInstructorCourses = async()=>{

        const tt = localStorage.getItem("authToken");
        if(!tt) return console.log("NO Tokem For Instructor");
        
        try {
            const res = await fetch(`${API_BASE}/courses/instructor`, {
                method:"GET",
                headers:{
                    // "Content-Type":"application/json",
                    "Authorization":`Bearer ${tt}`
                }
            })

            if(!res.ok) return console.log(res);
            

            const data = await res.json();
            console.log(data);
            setInstructorCourses(data.course)
            
        } catch (error) {
            console.log(error.message);
            
        }
    }









    useEffect(()=>{
        getInstructorCourses()
    }, [])



    return ( 
    <DBDContext.Provider value={
        {
            enrolledVerified, instructorCourses, loadingFormLecture, enrolledCourses,

            VerifyCourseEnroll, createCourse, getInstructorCourses, getIStudentEnrolledCourses,

            getInstructorLectures,
            createLecture,
            deleteInstLect,

        }
    }>
    {children}
    </DBDContext.Provider>
    )
}


const UseDashBoardContextProvider = ()=>{
    return useContext(DBDContext)
}

export {
    UseDashBoardContextProvider, DashBoardContextProvider
}