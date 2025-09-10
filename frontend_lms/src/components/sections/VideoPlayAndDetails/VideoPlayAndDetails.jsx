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
import LoadingAnim from "../../LoadingAnim";
import ErrorIndicates from "../../ErrorIndicates";

const VideoPlayAndDetails = () => {
  const { 
    haveToken,
    fetchCourseById, 
    loadSignedUrl, 
    startAutoRefresh,
    stopAutoRefresh,
    fullAccess ,

  } = useApiContext();


  const { VerifyCourseEnroll, enrolledVerified } = UseDashBoardContextProvider();

  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [freeLectures, setFreeLectures] = useState([]);

  const [showVideo, setShowVideo]= useState(false)

  const refreshRef = useRef(null);
  const activeLectureRef = useRef(null);
  const videoPlayerRef = useRef(null);

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
        setFreeLectures(free);
        setCourse(data?.course || data);
        setShowVideo(true)

        const firstLecture = (data?.course || data)?.lectures?.[0];
        if (firstLecture?._id) {
          activeLectureRef.current = firstLecture._id;
          setActiveIndex(0);
          await loadSignedUrl(firstLecture._id, setVideoUrl, id);
          startAutoRefresh(firstLecture._id, setVideoUrl, refreshRef, id);
        }
      } catch (e) {
        console.error("Course load failed:", e.message);
      }
    })();

    return () => {
      isMounted = false;
      stopAutoRefresh(refreshRef);
    };
  }, [id, haveToken]);

  const handleLectureClick = async (lectureId, index) => {
    setPlaying(false);
    setActiveIndex(index);
    activeLectureRef.current = lectureId;

    stopAutoRefresh(refreshRef);
    await loadSignedUrl(lectureId, setVideoUrl, id);
    startAutoRefresh(lectureId, setVideoUrl, refreshRef, id);
  };

  const togglePlaylist = () => setPlaylistOpen((prev) => !prev);

  const totalVideos = course?.lectures?.length || 0;
  const instructorName =
    typeof course?.instructor === "string"
      ? course?.instructor
      : course?.instructor?.name || "—";


  




  return (
    <div className="videoCourseContainer">
      <div className={showVideo? "videoSection show":"videoSection"}>
        <div
          className={playing ? "videoPlayer activePlay" : "videoPlayer"}
          data-lesson={`Class ${activeIndex + 1}`}
          onPlay={() => setPlaying(true)}
          style={{display: "block", width:"100%", height:"auto"}}
        >
          <video
            ref={videoPlayerRef}
            className="videoSource"
            poster={course?.thumbnail}
            controls
            preload="auto"
            autoPlay={true}
            muted
            onEnded={() => setPlaying(false)}
            // src={videoUrl}
          />
        </div>

        <p className="videoCourseTitle">{course?.title || ""}</p>

        <div className="courseDetailsSection">
          <div className="instructorDetails">
            <p className="instructorName">Instructor: {instructorName}</p>
            <p className="videoCount">Videos: {totalVideos}</p>
            <p className="courseDuration">Time: 5 hours</p>
            <p className="challengeDesc">20 DAYS DIGITAL MARKETING CHALLENGE, BANGLADESH.</p>
          </div>

          <div className="coursePricing">
            <div className="priceInfo">
              <p className="originalPrice">{course?.price ? Number(course.price) + 50 : 0}৳</p>
              <p className="salePrice">{course?.price || 0}৳</p>
            </div>
            <button className="startCourseBtn">Start Course</button>
          </div>
        </div>
      </div>

      <div className={playlistOpen ? "playlistSection open" : "playlistSection"} id={showVideo?"show":""}>
        <div className="playlistHeader">
          <h1>Course Video</h1>
          <p>{totalVideos} videos</p>
        </div>

        <div className="playlistItems">
          {course?.lectures?.sort((a,b)=> a.order - b.order).map((lec, i) => (
            <div
              className={activeIndex === i ? "playlistItemEnrolled active" : "playlistItemEnrolled"}
              key={lec?._id || i}
              onClick={() => handleLectureClick(lec?._id, i)}
            >
              <div className="lectureInfo">
                <div className="statusIcon enrolledStatusIcon">
                  {enrolledVerified ? (
                    <img src={activeIndex === i ? playIcon : checkIcon} className="statusImgEnrolled" />
                  ) : fullAccess ? (
                    <img src={checkIcon} className="statusImgEnrolled" />
                  ) : (
                    <img
                      src={freeLectures?.some((f) => f.order === lec.order) ? checkIcon : traiExIcon}
                      className="statusImgEnrolled"
                    />
                  )}
                </div>

                <div className="lectureDesc">
                  <p className="lectureTitle">Course Class {i + 1}</p>
                  <p className="lectureSubtitle">{lec?.title || "Untitled"}</p>
                </div>
              </div>

              <div className="lectureLock">
                {enrolledVerified ? (
                  <img src={eyeIcon} className="statusImgEnrolled" />
                ) : (
                  <img
                    src={freeLectures?.some((f) => f.order === lec.order) ? eyeIcon : lockIcon}
                    className="statusImgEnrolled"
                  />
                )}
                <span className="recentLectureIndicator"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={playlistOpen ? "togglePlaylistBtn active" : "togglePlaylistBtn"}
        onClick={togglePlaylist}
      >
        {playlistOpen ? "Close" : "See Playlist"}
      </div>
    </div>
  );
};

export default VideoPlayAndDetails;
