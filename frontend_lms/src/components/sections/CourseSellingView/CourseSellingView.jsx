// src/pages/course/VideoPlayAndDetails.jsx
// -------------------------------------------------------------
// ✅ Professional Course Landing (SEO + Responsive + Demo-only)
// - Big hero banner with gradient overlay
// - Only FREE lectures playable
// - 3–5 locked lessons previewed (dummy placeholders)
// - Sticky pricing sidebar with CTA
// - Instructor card, What you'll learn, Course overview
// - JSON-LD structured data + <Helmet> meta tags (SEO)
// - Clean, accessible, mobile-first layout
// -------------------------------------------------------------

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet"; // ⚠️ If not installed: `npm i react-helmet`
import { NavLink, useParams } from "react-router-dom";
import "./CourseSellingView.css";

// Icons
import traiExIcon from "/svgs/triangle-exclamation.svg";
import playIcon from "/svgs/play.svg";
import checkIcon from "/svgs/check.svg";
import lockIcon from "/svgs/lock.svg";
import eyeIcon from "/svgs/eye.svg";

// Contexts
import { useApiContext } from "../../../../Utils/ApiContext";
import { UseDashBoardContextProvider } from "../../../../Utils/DashBoardContext";
import Footer from "../Footer/Footer";

const CourseSellingView = () => {
  // ---------------- Contexts ----------------
  const {
    haveToken,
    fetchCourseById,
    loadSignedUrl,
    startAutoRefresh,
    stopAutoRefresh,
    fullAccess,
  } = useApiContext();

  const { VerifyCourseEnroll, enrolledVerified } = UseDashBoardContextProvider();

  // ---------------- State ----------------
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); // index inside free lectures list
  const [playing, setPlaying] = useState(false);
  const [freeLectures, setFreeLectures] = useState([]);
  const [togglePlaylistOpen, setTogglePlaylistOpen] = useState(false);
  const [errorLecture, setErrorLecture] = useState(false);
  const [activeErrorLecture, setActiveErrorLecture] = useState("");
  const [mode, setMode] = useState("dark")

  // ---------------- Refs ----------------
  const refreshTimerRef = useRef(null);
  const activeLectureIdRef = useRef(null);
  const videoRef = useRef(null);

  // ---------------- Derived ----------------
  const totalVideos = course?.lectures?.length || 0;
  const instructorName =
    typeof course?.instructor === "string"
      ? course?.instructor
      : course?.instructor?.name || "—";

  // Sort lectures by order once
  const sortedLectures = useMemo(() => {
    const list = course?.lectures ? [...course.lectures] : [];
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [course]);

  // Only free lectures for demo list
  const onlyFreeLectures = useMemo(
    () => sortedLectures.filter((l) => l?.isFree),
    [sortedLectures]
  );

  // Create 3–5 locked dummy placeholders
  const lockedPreviewCount = 4; // 👈 change 3–5 as you like
  const lockedPreviews = useMemo(() => {
    // pick the first N non-free lectures to present as locked preview.
    const lockedReal = sortedLectures.filter((l) => !l?.isFree).slice(0, lockedPreviewCount);

    // If there are less than N, fill with dummy placeholders
    const fillers = Array.from({ length: Math.max(0, lockedPreviewCount - lockedReal.length) }).map(
      (_, i) => ({
        _id: `locked-dummy-${i + 1}`,
        title: `Premium Lesson ${i + 1}`,
        order: 100 + i,
        __dummy: true, // 🔖 mark dummy
      })
    );
    return [...lockedReal, ...fillers];
  }, [sortedLectures]);

  // ---------------- Effects ----------------
  useEffect(() => {
    VerifyCourseEnroll(id);
  }, [id, VerifyCourseEnroll]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchCourseById(id);
        if (!alive || !data) return;

        const normalized = data?.course || data;
        setCourse(normalized);
        // console.log("Course _id", normalized);
        

        const free = (normalized?.lectures || []).filter((lec) => lec?.isFree) || [];
        setFreeLectures(free);

        // autoplay first free lecture if available; otherwise autoplay first lecture
        const firstPlayable = free[0] || normalized?.lectures?.[0];
        if (firstPlayable?._id) {
          activeLectureIdRef.current = firstPlayable._id;
          await loadSignedUrl(firstPlayable._id, setVideoUrl, id);
          startAutoRefresh(firstPlayable._id, setVideoUrl, refreshTimerRef, id);
        }
      } catch (e) {
        console.error("Course load failed:", e.message);
      }
    })();
    return () => {
      alive = false;
      stopAutoRefresh(refreshTimerRef);
    };
  }, [id, haveToken]);

  // Attach video URL to <video> tag
  useEffect(() => {
    const vid = videoRef.current;
    if (vid && videoUrl) {
      vid.src = videoUrl; // ⚠️ ensure your loadSignedUrl returns a browser-playable URL (HLS or mp4)
      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);
      vid.addEventListener("play", onPlay);
      vid.addEventListener("pause", onPause);
      return () => {
        vid.removeEventListener("play", onPlay);
        vid.removeEventListener("pause", onPause);
      };
    }
  }, [videoUrl]);

  // ---------------- Handlers ----------------
  const handlePickLecture = async (lecture, indexInFreeList) => {
    if (!lecture?._id) return;
    setPlaying(false);
    setActiveIndex(indexInFreeList);
    activeLectureIdRef.current = lecture._id;
    stopAutoRefresh(refreshTimerRef);
    await loadSignedUrl(lecture._id, setVideoUrl, id);
    startAutoRefresh(lecture._id, setVideoUrl, refreshTimerRef, id);
  };

  const handleLockedClick = (i) => {
    // You can integrate a modal/toast here
    setErrorLecture(true);
    setActiveErrorLecture(i)
    // alert("This is a premium lesson. Please enroll to unlock.");
  };

  const togglePlaylist = () => setTogglePlaylistOpen((p) => !p);

  // ---------------- SEO: Helmet + JSON-LD ----------------
  const pageTitle = course?.title ? `${course.title} – Online Course` : "Course";
  const pageDesc = course?.shortDescription ||
    "Learn with a modern, job-focused curriculum. Watch free lessons and unlock the full course."; // 🔖 fallback dummy
  const courseThumb = course?.thumbnail || "/images/placeholder-course-banner.jpg"; // 🔖 fallback dummy

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course?.title || "Online Course",
    description: pageDesc,
    provider: {
      "@type": "Organization",
      name: "YourAcademy", // 🔖 replace with your brand
      sameAs: "https://example.com", // 🔖 replace
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: {
        "@type": "Person",
        name: instructorName,
      },
    },
  };

  // Ratings & Enrolled count (dummy fallback with comments)
  const ratingValue = course?.ratings || 4.7; // 🔖 dummy if backend not supplied
  const ratingCount = course?.ratingCount || 1280; // 🔖 dummy
  const enrolledCount = course?.enrolledCount || 3560; // 🔖 dummy
  const level = course?.level || "Beginner to Advanced"; // 🔖 dummy
  const language = course?.language || "Bangla"; // 🔖 dummy
  const learningTags = course?.learningTags; // 🔖 dummy

  const price = Number(course?.price || 0);
  const oldPrice = price ? price + 50 : 0; // 🔖 simple strike-through logic

  return (
    <div className= {mode==="light"?"courseLandingRoot":"courseLandingRoot lgMode"}> 

          {/* <span className='noticeTop'>Safe Up To 30% Now</span> */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={courseThumb} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ---------------- Hero Banner ---------------- */}
      <header className="heroBanner" style={{"--hero": `url(${courseThumb})`}}>
        <div className={mode==="light"?"heroOverlay lgMode":"heroOverlay "}/>
        <div className="heroContent container">
          <div className="heroLeft">
            <h1 className="heroTitle">{course?.title || "Course Title"}</h1>
            <p className="heroSubtitle">{pageDesc}</p>
            <ul className="heroMeta" aria-label="course meta">
              <li><span aria-label="rating">⭐ {ratingValue}</span> <span className="muted">({ratingCount} ratings)</span></li>
              <li><span aria-label="students">👥 {enrolledCount} students</span></li>
              <li><span aria-label="level">🎯 {level}</span></li>
              <li><span aria-label="language">🌐 {language}</span></li>
            </ul>
            <div className="heroCTAs">
              <a href="#pricing" className="btnPrimary" aria-label="Buy now">Buy Now</a>
              <button className="btnGhost" onClick={() => {
                if (onlyFreeLectures[0]) handlePickLecture(onlyFreeLectures[0], 0);
                window.scrollTo({ top: document.getElementById("demoSection").offsetTop - 80, behavior: "smooth" })
              }}>Watch Free Lessons</button>
            </div>
          </div>

          {/* Sticky Pricing on desktop */}
          <aside className="heroRight" id="pricing" aria-label="pricing and purchase">
            <div className="pricingCard">
              <div className="priceRow topSticky">
                <span className="old">{oldPrice}৳</span>
                <span className="now">{price}৳</span>
              </div>
              <NavLink to={`/course/purchase/${course?._id}`} className="btnPrimary btnFull">Enroll Now</NavLink>
              <ul className="highlights">
                <li>✔ Lifetime access</li>
                <li>✔ Certificate of completion</li>
                <li>✔ Community & Q/A support</li>
                <li>✔ Downloadable resources</li>
              </ul>
              <p className="secureNote">🔒 7‑day refund guarantee</p>
            </div>
          </aside>
        </div>
      </header>

{/* mode==="light"?"lgMode":""   add this here wihtout ``::      <main className="container mainSectionContainer">  */}
      {/* ---------------- Main Content ---------------- */}
      <main className={mode==="light"?"lgMode container mainSectionContainer":"container mainSectionContainer "}> {/* gridTwo */}
        {/* Left: Content */}
        <section className="mainCol">
          {/* Demo Player */}
          <section id="demoSection" className="card sectionPad" aria-label="Free demo player">
            <div
              className={playing ? "videoWrapper playing" : "videoWrapper"}
              data-serial={`Class ${activeIndex + 1}`}
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

            {/* <div className="demoHeader">
              <h2 className="sectionTitle">Free Lessons</h2>
              <button
                className={togglePlaylistOpen ? "toggleCoursePlaylist active" : "toggleCoursePlaylist"}
                onClick={() => setTogglePlaylistOpen((p) => !p)}
                aria-expanded={togglePlaylistOpen}
                aria-controls="playlistPanel"
              >
                {togglePlaylistOpen ? "Close Playlist" : "See Playlist"}
              </button>
            </div> */}

            <div
              id="playlistPanel"
              className={togglePlaylistOpen ? "playlists open" : "playlists"}
              role="list"
            >
              {onlyFreeLectures.length === 0 && (
                <p className="muted">No free lessons available for preview.</p>
              )}

              {onlyFreeLectures.map((lec, i) => (
                <div
                  key={lec?._id || i}
                  role="listitem"
                  className={i === activeIndex ? "playlistItem active" : "playlistItem"}
                  onClick={() => handlePickLecture(lec, i)}
                >
                  <div className="left">
                    <span className="badge"><img className="badgeImage" src={i === activeIndex ? playIcon : checkIcon} alt="status" /></span>
                    <div className="txt">
                      <p className="title">Class {lec.order}: {lec?.title || "Untitled"}</p>
                      <p className="sub muted">Free preview</p>
                    </div>
                  </div>
                  <img src={eyeIcon} className="statusIcon" alt="viewable" />
                </div>
              ))}

              {/* Locked previews */}
              {lockedPreviews.map((lec, idx) => (
                <div
                  key={lec?._id || `locked-${idx}`}
                  role="listitem"
                  className="playlistItem locked"
                  id={ activeErrorLecture===idx && errorLecture? "errorLec":""}
                  onClick={()=>handleLockedClick(idx)}
                  aria-disabled="true"
                >
                  <div className="left">
                    <span className="badge lockedBadge"><img src={traiExIcon} alt="locked" /></span>
                    <div className="txt">
                      <p className="title"> Class {lec.order || `Premium Lesson ${idx + 1}`}</p>
                      <p className="sub muted">Locked – enroll to unlock</p>
                    </div>
                  </div>
                  <img src={lockIcon} className="statusIcon" alt="locked" />
                </div>
              ))}
            </div>
          </section>




 <aside className="sideCol testSidecol">
          <div className="card sectionPad stickyCard">
            <h3 className="sectionTitle small">Buy this course</h3>
            <p className="secureNote">🔒 Safe checkout • Instant access</p>
            <ul className="highlights compact">
              <li>Lifetime access</li>
              <li>Certificate</li>
              <li>Community support</li>
            </ul>
          </div>

          <div className="sidecol_Prices">
            <div className="priceRow">
              <span className="old">{oldPrice}৳</span>
              <span className="now">{price}৳</span>
            </div>
          <NavLink to={`/course/purchase/${course?._id}`} className="btnPrimary btnFull enrollBtn">Enroll Now</NavLink>
          </div>

  </aside>





          {/* What you'll learn */}
          <section className="card sectionPad" aria-label="learning outcomes">
            <h2 className="sectionTitle">What you’ll learn</h2>
            <ul className="bulletGrid">

              {
                learningTags?.map((tags=>{

                  return <li>{tags}</li>
                }))
              }
            </ul>
          </section>

          {/* Course overview */}
          <section className="card sectionPad" aria-label="course overview">
            <h2 className="sectionTitle">Course overview</h2>
            <p className="bodyText">
              {course?.description || (
                <>
                  {/* 🔖 Dummy long description if not provided */}
                  This comprehensive course walks you through fundamentals to advanced topics with hands‑on
                  projects. Perfect for beginners transitioning into professional roles and professionals
                  looking to refresh skills. Learn with concise lessons, practical demos and downloadable
                  resources.
                </>
              )}
            </p>
          </section>

          {/* Instructor */}
          <section className="card sectionPad indtructorInfo" aria-label="instructor">
            <h2 className="sectionTitle">Instructor</h2>
            <div className="instructorRow">
              <img
                src={course?.instructor?.photo || "https://res.cloudinary.com/drqvcjakw/image/upload/v1731510469/adnhhh22the7obqhfmzw.jpg"}
                alt={instructorName}
                className="avatar"
              />
              <div className="text-wrap">
                <p className="instName">{instructorName}</p>
                <p className="muted instBio ">
                  {course?.instructor?.bio ||
                    "Senior instructor with 7+ years of industry experience. Passionate about outcome‑driven learning."}
                </p>
               
              </div>

              
            </div>
             <div className="instLinks">
                  {/* 🔖 Replace with real links */}
                  <a href="#" aria-label="Instructor Website">Website</a>
                  <a href="#" aria-label="LinkedIn">LinkedIn</a>
                  <a href="#" aria-label="Twitter">Twitter/X</a>
                </div>
          </section>





        {/* <aside className="sideCol purchaseSection">
          <div className="card sectionPad stickyCard">
            <h3 className="sectionTitle small">Buy this course</h3>
            <div className="priceRow">
              <span className="old">{oldPrice}৳</span>
              <span className="now">{price}৳</span>
            </div>
            <button className="btnPrimary btnFull">Enroll Now</button>
            <p className="secureNote">🔒 Safe checkout • Instant access</p>
            <ul className="highlights compact">
              <li>Lifetime access</li>
              <li>Certificate</li>
              <li>Community support</li>
            </ul>
          </div>
        </aside> */}



        </section>

        {/* Right: Sticky aside on mobile too (below) – duplicated CTA for mobile */}
    


          <div className="toggleMode" onClick={()=>mode==="light"? setMode("dark"):setMode("light")}>
            {
              mode==="light"? "Mode Light": "Mode Dark"
            }
          </div>
      </main>



      <Footer/>
    </div>
  );
};

export default CourseSellingView;
