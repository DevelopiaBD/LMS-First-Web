import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Hls from "hls.js";



const ApiContext = createContext();

const API_BASE = "http://localhost:5000/api"; // replace with your actual API base URL





const ApiContextProvider = ({children}) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [haveToken, setHaveToken] = useState(null);
    const [courseData, setCourseData] = useState([]);
    const [ApprovedCourseData, setApprovedCourseData] = useState([]);
    const [singleCourseData, setSingleCouourseData] = useState([]);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [fullAccess, setFullAccess] = useState(false);
    

    // console.log(LoggedIn);
    // console.log(user);

    // console.log("Have token:", haveToken);
    const Authorization = `Authorization: Bearer ${haveToken}`
    
    useEffect(() => {


        GetAllCourse();
        
        const token = localStorage.getItem("authToken");
        if (!token) {
            setHaveToken(null);
            return
        } else {
            setHaveToken(token);
        }


    // console.log(LoggedIn);

    }, []);



    // const authHeader = () => {
    //     const token = localStorage.getItem("authToken");
    //     return token ? { Authorization: `Bearer ${token}` } : {};
    // };
    



    // GetAllCourse

    const GetAllCourse = async()=>{
        try {
            const response = await fetch(`${API_BASE}/courses`, {
                method: 'GET',
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Course Fetch failed");
            } 

            const data = await response.json();

            const ApprovedCourses = data.filter(course => course.isApproved);    
            console.log("Course Fetch successfully:", data);
            // console.log(ApprovedCourses);
            setCourseData(data)
            setApprovedCourseData(ApprovedCourses)


        } catch (error) {
            console.error("Error during Getting All Course:", error.message || "Unknown error");
        }    
    }








    const GetSingleCourse = async(id)=>{
        try {
            const response = await fetch(`${API_BASE}/courses/${id}`, {
                method: 'GET',
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Single Course Fetch failed");
            } 

            const data = await response.json();
            console.log("Single Course Fetch successfully:", data);
            setSingleCouourseData(data)
            


        } catch (error) {
            console.error("Error during Getting Single Course:", error.message || "Unknown error");
        }    
    }










    const createCourse = async(formdata)=>{
        try {
            const response = await fetch(`${API_BASE}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Course Creating failed");
            } 

            const data = await response.json();
            console.log("Course Created successfully:", data);
            setCourseData(data)
            


        } catch (error) {
            console.error("Error during Creating Course:", error.message || "Unknown error");
        }    
    }














    //  User Functions......................

    const UserRegistration = async(formdata)=>{
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            } 

            const data = await response.json();
            console.log("User registered successfully:", data);
            alert("Registration successful! Now log in.");
            navigate("/login");
            


        } catch (error) {
            console.error("Error during user login:", error.message || "Unknown error");
        }
    }

    

    



let isRefreshing = false; // global flag

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  if (!options.headers) options.headers = {};
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, credentials: "include" });

    if (response.status === 401 && !isRefreshing) {
      isRefreshing = true; // ✅ একবারই চলবে

      const userConfirm = window.confirm("Session expired! Do you want to login again?");
      if (userConfirm) {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh token failed");
        }

        const refreshData = await refreshRes.json();
        localStorage.setItem("authToken", refreshData.accessToken);

        // retry
        options.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
        isRefreshing = false; // reset
        return await fetch(url, options);
      } else {
        localStorage.removeItem("authToken");
        isRefreshing = false;
        throw new Error("User declined re-login");
      }
    }

    return response;
  } catch (err) {
    console.error("Auth fetch error:", err.message);
    throw err;
  }
};












    const getUserProfile = async () => {

        const token = localStorage.getItem("authToken");
        if(!token){
            return
        }


    try {
        const res = await fetchWithAuth(`${API_BASE}/auth/user/profile`);
        if (!res.ok){
            
            if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Profile fetch failed: ${res.status} ${errText}`);
            }
        }
        const data = await res.json();
        setUser(data.user);
        

        console.log("Profile:", data);
    } catch (err) {
        console.error(err.message);
        console.log(err);
        
    }
    };


    
    
    
    const UserLogin = async(formdata)=>{
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Add this for cookies
                body: JSON.stringify(formdata),
            });
            
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            } 
            
            const data = await response.json();
            // console.log("User Login successfully:", data);
            alert("Logged in successful! Now log in.");
            
            localStorage.setItem("authToken", data.accessToken);
             setTimeout(() => {
                navigate("/");
                window.location.reload()
            }, 500);

            
            
            
        } catch (error) {
            console.error("Error during user login:", error.message || "Unknown error");
        }
    }
    
    
    
    
    
    const LogOutUser = async()=>{
        try {
            
            const res= await fetch(`${API_BASE}/auth/logout`, {
                method: "POST"
            });

            if(!res.ok){
                console.log("Try Later");
                return
            }

            localStorage.removeItem("authToken");
            setUser(null);
            setTimeout(() => {
                navigate("/");
                window.location.reload()
            }, 500);

        } catch (error) {
            console.log(error.message);
        }
    }

    
    
    
    
    
    
    // Video
    // ............................................

  const fetchCourseById = async (courseId) => {
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}`);
      const data = await res.json();
      console.log(data);
      
      if (!res.ok) throw new Error(data.message || "Failed to fetch course");
      return data;
    } catch (err) {
      console.error("fetchCourseById error:", err.message);
      return null;
    }
  };

  // Load signed URL and attach with HLS
  const loadSignedUrl = async (lectureId, setVideoUrl, courseId) => {
    try {
      const res = await fetch(
        `${API_BASE}/lectures/${lectureId}/${courseId}/stream`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${(localStorage.getItem("authToken"))}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);
      setFullAccess(data?.fullAccess)
      
      const url = data?.signedUrl || "";
      setVideoUrl(url);

      const video = document.querySelector("video.VideoSrc");
      if (video) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url; // Safari
        }
      }
    } catch (err) {
      console.error("loadSignedUrl error:", err.message);
      setVideoUrl("");
    }
  };

  // Auto refresh signed URL
  const startAutoRefresh = (lectureId, setVideoUrl, ref, courseId) => {
    stopAutoRefresh(ref);
    ref.current = setInterval(async () => {
      await loadSignedUrl(lectureId, setVideoUrl, courseId);
    }, 4 * 60 * 1000); // 4 min
  };

  // Stop auto refresh
  const stopAutoRefresh = (ref) => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  };





    // Video
    // ............................................
    
    
    
    useEffect(()=>{
        getUserProfile()
        
    },[])
    


    
    
    
    
    return (
        <ApiContext.Provider value={
            { 
                API_BASE,
                user,
                haveToken,
                courseData,
                singleCourseData,
                ApprovedCourseData,
                Authorization,
                LoggedIn,
                fullAccess,
                
                
                UserRegistration,
                UserLogin,
                createCourse,
                GetSingleCourse,
                LogOutUser,


                // video
                fetchCourseById,
                loadSignedUrl,
                startAutoRefresh,
                stopAutoRefresh,
                
            }
        }
        >
        {children}
        </ApiContext.Provider>
    );
}

const useApiContext = () => {
    return useContext(ApiContext);
};



export { ApiContextProvider, useApiContext };