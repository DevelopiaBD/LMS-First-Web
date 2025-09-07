// // src/pages/course/VideoPlayAndDetails.jsx
// import React, { useEffect, useState, useRef } from "react";
// import Hls from "hls.js"; // ✅ Added for HLS playback
// import "./VideoPlayAndDetails.css";

// import thumb1 from "/images/THUMB12.jpg";
// import traiExIcon from "/svgs/triangle-exclamation.svg";
// import playIcon from "/svgs/play.svg";
// import checkicon from "/svgs/check.svg";
// import lockicon from "/svgs/lock.svg";
// import eyeIcon from "/svgs/eye.svg";
// import unlockicon from "/svgs/unlock.svg"; // need later

// import { useParams } from "react-router-dom";
// import { useApiContext } from "../../../Utils/ApiContext";
// import { UseDashBoardContextProvider } from "../../../Utils/DashBoardContext";

// const API_BASE = "http://localhost:5000/api"; // replace with your actual API base URL

// const VideoPlayAndDetails = () => {
//   const { haveToken } = useApiContext();
//   const {VerifyCourseEnroll, enrolledVerified} = UseDashBoardContextProvider()

//   const { id } = useParams(); // courseId বা slug
//   const [course, setCourse] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [toggleactive, setToggleactive] = useState(false);

//   const [playing, setPlaying] = useState(false);
//   const [free, setFree] = useState([]);
//   const refreshTimerRef = useRef(null);
//   const activeLectureIdRef = useRef(null);
//   const videoRef = useRef(null); // ✅ Ref for <video> element

//   // Fetch course + lectures

//   useEffect(()=>{
//     VerifyCourseEnroll(id)
//   },[])



//   useEffect(() => {
//     let isMounted = true;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/courses/${id}`, {
//           method: "GET",
//           // headers: { Authorization: `Bearer ${haveToken}` },
//         });
//         const data = await res.json();

//         if (!isMounted) return;
//         if (!res.ok) {
//           return console.error("Failed to load course:", data.message || "Unknown error");
//         }

//         const freeLectures = data?.lectures?.filter((lec) => lec.isFree) || [];
//         setFree(freeLectures);
//         setCourse(data?.course || data);

//         // প্রথম লেকচার সিলেক্ট
//         const firstLecture = (data?.course || data)?.lectures?.[0];
//         if (firstLecture?._id) {
//           activeLectureIdRef.current = firstLecture._id;
//           setActiveIndex(0);
//           await loadSignedUrl(firstLecture._id, setVideoUrl, id);
//           startAutoRefresh(firstLecture._id, setVideoUrl, refreshTimerRef);
//         }
//       } catch (e) {
//         console.error("Course load failed:", e.message);
//       }
//     })();
//     return () => {
//       isMounted = false;
//       stopAutoRefresh(refreshTimerRef);
//     };
//   }, [id, haveToken]);

//   // click handler: playlist item
//   const handlePickLecture = async (lectureId, index) => {

//     setPlaying(false)
//     setActiveIndex(index);
//     activeLectureIdRef.current = lectureId;
//     stopAutoRefresh(refreshTimerRef);
//     await loadSignedUrl(lectureId, setVideoUrl, id);
//     startAutoRefresh(lectureId, setVideoUrl, refreshTimerRef);
//   };

//   // toggle playlist
//   const togglePlaylist = () => setToggleactive((p) => !p);

//   const totalVideos = course?.lectures?.length || 0;
//   const instructorName =
//     typeof course?.instructor === "string" ? course?.instructor : course?.instructor?.name || "—";




    
//   // if(enrolledVerified){
//   //   return <h1>No Course</h1>
//   // }





//   return (
//     <div className="courseVideoMainDiv">
//       <div className="courseVideoAndPricing">
//       <div className={playing? "videoWrapper playing": "videoWrapper "} data-serial={`Class ${activeIndex + 1}`} onPlay={()=>setPlaying(true)} >
//   <video
//     ref={videoRef}
//     className="VideoSrc"
//     poster={course?.thumbnail}
//     controls
//     preload="none"
//     autoPlay={false}
//   />
// </div>

//         <p className="courseTitle">{course?.title || ""}</p>

//         <div className="coursePriceInstruc">
//           <div className="courseDetails">
//             <p className="instructor">Instructor: {instructorName}</p>
//             <p className="videoQt">Videos: {totalVideos}</p>
//             <p className="timesLength">Time: 5 hours</p>
//             <p className="ChellengeDesc">20 DAYS DIGITAL MARKETING CHALLENGE, BANGLADESH.</p>
//           </div>

//           <div className="coursePrice">
//             <div className="prices">
//               <p className="oldPrice">{course?.price ? Number(course.price) + 50 : 0}৳</p>
//               <p className="sellPrice">{course?.price || 0}৳</p>
//             </div>
//             <button className="startCourseButton">Start Course</button>
//           </div>
//         </div>
//       </div>

//       <div className={toggleactive ? "videoPlayListsMainDiv activeToggle" : "videoPlayListsMainDiv"}>
//         <div className="titlePlaylist">
//           <h1>Course Video</h1>
//           <p>{totalVideos} videos</p>
//         </div>

//         <div className="playlistsOfCourse">
//           {course?.lectures?.map((lec, i) => (
//             <div
//               className={activeIndex === i ? "playlistDiv active" : "playlistDiv"}
//               key={lec?._id || i}
//               onClick={() => handlePickLecture(lec?._id, i)}
//             >
//               <div className="nameAndTic">
//                 <div className="ticDiv">
//                    {
//                   enrolledVerified?
//                   <img
//                   src={activeIndex===i? playIcon: checkicon}
//                   className="indicatesImgs"
//                 />:
//                 <img
//                   src={ free?.some((or) => or.order === lec.order) ? checkicon : traiExIcon}
//                   className="indicatesImgs"
//                 />
//                 }
//                 </div>

//                 <div className="descDiv">
//                   <p className="classesTT">Course Class {i + 1}</p>
//                   <p className="classesDesc">{lec?.title || "Untitled"}</p>
//                 </div>
//               </div>

//               <div className="lockIndicates">
//                 {
//                   enrolledVerified?
//                   <img
//                   src={eyeIcon}
//                   className="indicatesImgs"
//                 />:
//                 <img
//                   src={ free?.some((or) => or.order === lec.order) ? eyeIcon : lockicon}
//                   className="indicatesImgs"
//                 />
//                 }
//                 <span className="recentVideoIndictor"></span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div
//         className={toggleactive ? "toggleCoursePlaylist active" : "toggleCoursePlaylist"}
//         onClick={togglePlaylist}
//       >
//         {toggleactive ? "Close" : "See Playlist"}
//       </div>
//     </div>
//   );
// };

// export default VideoPlayAndDetails;

// // -------------------------
// // helpers
// // -------------------------

// // ✅ Load signed URL + initialize HLS playback
// async function loadSignedUrl(lectureId, setVideoUrl, courseId) {
//   try {
//     const res = await fetch(`${API_BASE}/lectures/${lectureId}/${courseId}/stream`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${JSON.parse(localStorage.getItem("authToken"))}`,
//       },
//     });

//     const data = await res.json();
//     const url = data?.signedUrl || "";
//     setVideoUrl(url);

//     // -------------------------
//     // HLS.js handling for secure streaming
//     // -------------------------
//     const video = document.querySelector("video.VideoSrc");
//     if (video) {
//       if (Hls.isSupported()) {
//         const hls = new Hls();
//         hls.loadSource(url);
//         hls.attachMedia(video);
//       } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//         // For Safari
//         video.src = url;
//       }
//     }
//   } catch (e) {
//     console.error("Signed URL load failed:", e.message);
//     setVideoUrl("");
//   }
// }

// // -------------------------
// // Auto refresh signed URL every 4 minutes
// // -------------------------
// function startAutoRefresh(lectureId, setVideoUrl, ref) {
//   stopAutoRefresh(ref);
//   ref.current = setInterval(async () => {
//     await loadSignedUrl(lectureId, setVideoUrl, id);
//   }, 4 * 60 * 1000); // 4 minutes
// }

// function stopAutoRefresh(ref) {
//   if (ref.current) {
//     clearInterval(ref.current);
//     ref.current = null;
//   }
// }


























// src/pages/course/VideoPlayAndDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import "./VideoPlayAndDetails.css";

import traiExIcon from "/svgs/triangle-exclamation.svg";
import playIcon from "/svgs/play.svg";
import checkIcon from "/svgs/check.svg";
import lockIcon from "/svgs/lock.svg";
import eyeIcon from "/svgs/eye.svg";

import { useParams } from "react-router-dom";
import { useApiContext } from "../../../../Utils/ApiContext";
import { UseDashBoardContextProvider } from "../../../../Utils/DashBoardContext";

const VideoPlayAndDetails = () => {
  /** ---------------- Contexts ---------------- */
  const {
    haveToken,
    fetchCourseById,
    loadSignedUrl,
    startAutoRefresh,
    stopAutoRefresh,
    fullAccess,
    
  } = useApiContext();

  const { VerifyCourseEnroll, enrolledVerified } = UseDashBoardContextProvider();

  /** ---------------- State ---------------- */
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [togglePlaylistOpen, setTogglePlaylistOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [freeLectures, setFreeLectures] = useState([]);

  /** ---------------- Refs ---------------- */
  const refreshTimerRef = useRef(null);
  const activeLectureIdRef = useRef(null);
  const videoRef = useRef(null);

  /** ---------------- Effects ---------------- */
  useEffect(() => {
    VerifyCourseEnroll(id);
  }, [id, VerifyCourseEnroll]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await fetchCourseById(id);
        if (!isMounted || !data) return;

        const free = data?.lectures?.filter((lec) => lec.isFree) || [];
        console.log(free);
        
        setFreeLectures(free);
        setCourse(data?.course || data);

        const firstLecture = (data?.course || data)?.lectures?.[0];
        if (firstLecture?._id) {
          activeLectureIdRef.current = firstLecture._id;
          setActiveIndex(0);
          await loadSignedUrl(firstLecture._id, setVideoUrl, id);
          startAutoRefresh(firstLecture._id, setVideoUrl, refreshTimerRef, id);
        }
      } catch (e) {
        console.error("Course load failed:", e.message);
      }
    })();

    return () => {
      isMounted = false;
      stopAutoRefresh(refreshTimerRef);
    };
  }, [id, haveToken]);

  /** ---------------- Handlers ---------------- */
  const handlePickLecture = async (lectureId, index) => {
    setPlaying(false);
    setActiveIndex(index);
    activeLectureIdRef.current = lectureId;

    stopAutoRefresh(refreshTimerRef);
    await loadSignedUrl(lectureId, setVideoUrl, id);
    startAutoRefresh(lectureId, setVideoUrl, refreshTimerRef, id);
  };

  const togglePlaylist = () => setTogglePlaylistOpen((prev) => !prev);

  /** ---------------- Derived ---------------- */
  const totalVideos = course?.lectures?.length || 0;
  const instructorName =
    typeof course?.instructor === "string"
      ? course?.instructor
      : course?.instructor?.name || "—";

  /** ---------------- Render ---------------- */
  return (
    <div className="courseVideoMainDiv">
      {/* ---------------- Video Player ---------------- */}
      <div className="courseVideoAndPricing">
        <div
          className={playing ? "videoWrapper playing" : "videoWrapper"}
          data-serial={`Class ${activeIndex + 1}`}
          onPlay={() => setPlaying(true)}
        >
          <video
            ref={videoRef}
            className="VideoSrc"
            poster={course?.thumbnail}
            controls
            preload="none"
            autoPlay={true}
          />
        </div>

        <p className="courseTitle">{course?.title || ""}</p>

        {/* ---------------- Course Details + Pricing ---------------- */}
        <div className="coursePriceInstruc">
          <div className="courseDetails">
            <p className="instructor">Instructor: {instructorName}</p>
            <p className="videoQt">Videos: {totalVideos}</p>
            <p className="timesLength">Time: 5 hours</p>
            <p className="ChellengeDesc">
              20 DAYS DIGITAL MARKETING CHALLENGE, BANGLADESH.
            </p>
          </div>

          <div className="coursePrice">
            <div className="prices">
              <p className="oldPrice">
                {course?.price ? Number(course.price) + 50 : 0}৳
              </p>
              <p className="sellPrice">{course?.price || 0}৳</p>
            </div>
            <button className="startCourseButton">Start Course</button>
          </div>
        </div>
      </div>

      {/* ---------------- Playlist ---------------- */}
      <div
        className={
          togglePlaylistOpen
            ? "videoPlayListsMainDiv activeToggle"
            : "videoPlayListsMainDiv"
        }
      >
        <div className="titlePlaylist">
          <h1>Course Video</h1>
          <p>{totalVideos} videos</p>
        </div>

        <div className="playlistsOfCourse">
          {course?.lectures?.sort((a,b)=> a.order - b.order).map((lec, i) => (
            <div
              className={
                activeIndex === i ? "playlistDiv active" : "playlistDiv"
              }
              key={lec?._id || i}
              onClick={() => handlePickLecture(lec?._id, i)}
            >
              <div className="nameAndTic">
                <div className="ticDiv">
                  {enrolledVerified ? (
                    <img
                      src={activeIndex === i ? playIcon : checkIcon}
                      className="indicatesImgs"
                    />
                  ) : (
                    fullAccess?
                    <img src={checkIcon} className="indicatesImgs" />
                    :
                    (<img
                      src={
                        freeLectures?.some((f) => f.order === lec.order)
                          ? checkIcon
                          : traiExIcon
                      }
                      className="indicatesImgs"
                    />)
                  )}
                </div>

                <div className="descDiv">
                  <p className="classesTT">Course Class {i + 1}</p>
                  <p className="classesDesc">{lec?.title || "Untitled"}</p>
                </div>
              </div>

              <div className="lockIndicates">
                {enrolledVerified ? (
                  <img src={eyeIcon} className="indicatesImgs" />
                ) : (
                  <img
                    src={
                      freeLectures?.some((f) => f.order === lec.order)
                        ? eyeIcon
                        : lockIcon
                    }
                    className="indicatesImgs"
                  />
                )}
                <span className="recentVideoIndictor"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Toggle Playlist ---------------- */}
      <div
        className={
          togglePlaylistOpen
            ? "toggleCoursePlaylist active"
            : "toggleCoursePlaylist"
        }
        onClick={togglePlaylist}
      >
        {togglePlaylistOpen ? "Close" : "See Playlist"}
      </div>
    </div>
  );
};

export default VideoPlayAndDetails;
