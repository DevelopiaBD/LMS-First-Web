import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Hls from "hls.js";
import reducerApiContFn from './reducerApiContFn';



const ApiContext = createContext();

const API_BASE = "http://localhost:5000/api"; // replace with your actual API base URL


let initialValue = {
  ApiLoading: false,
  ApiError: false,

  CourseLoading: false,
  CourseError: false,
}


const ApiContextProvider = ({children}) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [haveToken, setHaveToken] = useState(null);
    const [courseData, setCourseData] = useState([]);
    const [ApprovedCourseData, setApprovedCourseData] = useState([]);
    const [singleCourseData, setSingleCourseData] = useState([]);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [fullAccess, setFullAccess] = useState(false);
    


    const [state, dispatch] = useReducer(reducerApiContFn, initialValue);





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


      dispatch({type:"Set_Load_Get_User"})
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

            // setTimeout(() => {
              dispatch({type:"STOP_Load_Get_User"})
            // }, 2000);
            setSingleCourseData(data)
            


        } catch (error) {
          dispatch({type:"Set_Error_Get_User"})
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








// dispatch({type:"STOP_Load_Get_User"})




    const getUserProfile = async () => {


        const token = localStorage.getItem("authToken");
        if(!token){
          return
        }
        dispatch({type:"Set_Load_Get_User"})
        
        try {
          const res = await fetchWithAuth(`${API_BASE}/auth/user/profile`);

            if (!res.ok) {
              const errText = await res.text();
              throw new Error(`Profile fetch failed: ${res.status} ${errText}`);
            
          }
          const data = await res.json();
          setUser(data.user);
          setTimeout(() => {
            dispatch({type:"STOP_Load_Get_User"})
          }, 2000);
          
          
          console.log("Profile:", data);
        } catch (err) {
          console.error(err.message);
          console.log(err);
          dispatch({type:"Set_Error_Get_User"})
          
        }
      };


    
    


      // .........................


    const UpdateUserProfile = async(formdata)=>{
        const tt = localStorage.getItem("authToken")
        if(!tt){
          return console.log("Not Login");
        }

        try {
            const response = await fetch(`${API_BASE}/auth/profile/update`, {     
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${tt}`, // Capital A দিয়ে
                //     'Content-Type': 'application/json',
                },
                body: formdata,
            }); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Profile Update failed");
            }
            const data = await response.json();
            console.log("Profile Updated successfully:", data);
            setUser(data.user)
            alert("Profile Updated successfully!");
            // navigate("/profile");


            return "ok"
        } catch (error) {
            console.error("Error during Profile Update:", error.message || "Unknown error");
            
        }
          
      }


        // .........................






    
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


    dispatch({type:"Set_Load_Course_Get"})
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}`);
      const data = await res.json();
      console.log(data);
      
      if (!res.ok) throw new Error(data.message || "Failed to fetch course");

      setTimeout(() => {
        dispatch({type:"STOP_Load_Course_Get"})
      }, 2000);
      return data;

    } catch (err) {
      console.error("fetchCourseById error:", err.message);
      dispatch({type:"Set_Error_Course_Get"})
      return null;
    }
  };

  // Load signed URL and attach with HLS
  // const loadSignedUrl = async (lectureId, setVideoUrl, courseId) => {
  //   try {
  //     const res = await fetch(
  //       `${API_BASE}/lectures/${lectureId}/${courseId}/stream`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${(localStorage.getItem("authToken"))}`,
  //         },
  //       }
  //     );

  //     const data = await res.json();
  //     console.log(data);
  //     setFullAccess(data?.fullAccess)
      
  //     const url = data?.signedUrl || "";
  //     console.log("", url);
      
  //     setVideoUrl(url);

  //     const video = document.querySelector("video.videoSource");
  //     if (video) {
  //       if (Hls.isSupported()) {
  //         const hls = new Hls();
  //         hls.loadSource(url);
  //         hls.attachMedia(video);
  //       } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
  //         video.src = url; // Safari
  //       }
  //     }
  //   } catch (err) {
  //     console.error("loadSignedUrl error:", err.message);
  //     setVideoUrl("");
  //   }
  // };

const loadSignedUrl = async (lectureId, setVideoUrl, courseId) => {
  try {
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${API_BASE}/lectures/${lectureId}/${courseId}/stream`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    setFullAccess(data?.fullAccess);

    const url = data?.signedUrl;
    if (!url) return;

    const video = document.querySelector("video.videoSource");
    if (!video) return;

    // Destroy old HLS instance
    if (video._hls) {
      video._hls.destroy();
      video._hls = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      video._hls = hls;
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(url);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = true; // autoplay safe
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.muted = true;
      video.play().catch(() => {});
    }

    // ✅ Update state AFTER HLS attach
    setVideoUrl(url);

  } catch (err) {
    console.error(err);
    setVideoUrl("");
  }
};












//   const loadSignedUrl = async (lectureId, setVideoUrl, courseId) => {
//   try {
//     const res = await fetch(
//       `${API_BASE}/lectures/${lectureId}/${courseId}/stream`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       }
//     );

//     const data = await res.json();
//     setFullAccess(data?.fullAccess);

//     const url = data?.signedUrl || "";
//     if (!url) {
//       setVideoUrl("");
//       console.warn("Signed URL missing, cannot play video");
//       return;
//     }

//     setVideoUrl(url);

//     const video = videoPlayerRef.current;
//     if (video) {
//       if (Hls.isSupported()) {
//         const hls = new Hls();
//         hls.loadSource(url);
//         hls.attachMedia(video);
//       } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//         video.src = url; // Safari
//       } else {
//         video.src = url; // fallback
//       }
//     }
//   } catch (err) {
//     console.error("loadSignedUrl error:", err.message);
//     setVideoUrl("");
//   }
// };











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





  // Payment Create And Others................

  // src/api/paymentApi.js
const createPayment = async (paymentData) => {
  try {
    const res = await fetch("http://localhost:5000/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await res.json();

    // সরাসরি return করে দাও, frontend এ success/error client decide করবে
    return {
      ok: res.ok,
      status: res.status,
      ...data,
    };

  } catch (error) {
    console.error("Payment API error:", error.message);
    return { ok: false, message: error.message };
  }
};



  // Payment Create And Others................


    // Video
    // ............................................
    
    
    
    useEffect(()=>{
        getUserProfile()
        
    },[])
    


    
    
    
    
    return (
        <ApiContext.Provider value={
            { 
                ...state,
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
                UpdateUserProfile,

                createCourse,
                GetSingleCourse,
                LogOutUser,
                createPayment,


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