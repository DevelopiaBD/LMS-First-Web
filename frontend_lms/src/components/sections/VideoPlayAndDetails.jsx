import React, { useState } from 'react';
import "./VideoPlayAndDetails.css";

import thumb1 from "../../../public/images/THUMB12.jpg"
import checkicon from "../../../public/svgs/check.svg"
import lockicon from "../../../public/svgs/lock.svg"
import unlockicon from "../../../public/svgs/unlock.svg"


import vid1 from "/videos/LMS_NEW_PROJECT.mp4";
//  "https://res.cloudinary.com/drqvcjakw/video/upload/v1754666707/LMS_NEW_PROJECT_v6qp6v.mp4"

const ab =[ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

const VideoPlayAndDetails = () => {

    const [toggleactive, setToggleactive] = useState(false)

  return (
        <div className="courseVideoMainDiv">
            <div className="courseVideoAndPricing">
                <video
                src={vid1}
                className='VideoSrc'
                poster={thumb1}
                controls
                />

                <p className="courseTitle">Digital Marketing Blust Course 2025. Now Market is yours</p>

                <div className="coursePriceInstruc">
                    <div className="courseDetails">
                        <p className="instructor">Instructor: Muhammad Abir</p>
                        <p className="videoQt">Videos: 100</p>
                        <p className="timesLength">Time: 5 hours</p>
                        <p className="ChellengeDesc">20 DAYS DIGITAL MARKETING CHALLENGE, BANGLADESH.</p>
                    </div>

                    <div className="coursePrice">
                        <div className="prices">
                            <p className='oldPrice'>800৳</p>
                            <p className='sellPrice'>500৳</p>
                        </div>

                        <button className='startCourseButton'>Start Course</button>
                    </div>
                </div>
            </div>






            <div className='videoPlayListsMainDiv' >
                <div className="titlePlaylist">
                    <h1>Course Video</h1>
                    <p>{ab.length} videos</p>
                </div>

                <div className="playlistsOfCourse">
                {
                    ab.map((classesVideo, i)=>{
                        
                    return <div className="playlistDiv" key={i}>
                        <div className="nameAndTic">
                            <div className="ticDiv">
                                <img src={checkicon} className=''/>
                            </div>

                            <div className="descDiv">
                                <p className="classesTT">Course Class {i+1}</p>
                                <p className="classesDesc">Introduction to Digital Marketing</p>
                            </div>
                        </div>




                        <div className="lockIndicates">
                            <img src={lockicon}  className='indicatesImgs'/>
                            {/* <img src={unlockicon}  className='indicatesImgs'/> */}
                            <span className='recentVideoIndictor'></span>
                        </div>
                    </div>

                    })
                }

                </div>
                
            </div>


            <div className="toggleCoursePlaylist">Playlist</div>
        </div>
  )
}

export default VideoPlayAndDetails