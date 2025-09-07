import React, { act, useEffect } from 'react';
import "./InstructorSingleCourse.css"
import { useApiContext } from '../../../../Utils/ApiContext';
import { useParams } from 'react-router-dom';
import { UseDashBoardContextProvider } from '../../../../Utils/DashBoardContext';
import { useState } from 'react';
import LectureForm from '../LectureForm/LectureForm';
import useFormHook from '../../../Hooks/useFormHook';
import LoadingController from '../../../LoadingController/LoadingController';
import ImageIcons from '../../ImageIcons/ImageIcons';
import deleteIcon from "/svgs/delete-left.svg"
import plusIcon from "/svgs/plus.svg"

const InstructorSingleCourse = () => {

  const {id} = useParams()
  const {GetSingleCourse, singleCourseData} = useApiContext();
  const {getInstructorLectures, deleteInstLect} = UseDashBoardContextProvider();
  const [formdata, setFormdata] = useState(null);
  const [formOn, setFormOn] = useState(false);
  const [newformOn, setNewFormOn] = useState(false);

  const [activeList, setActiveList] = useState(null)
  const [playedVideoInstructor, setPlayedVideoInstructor] = useState({})
  const [recentLecture, setRecentLecture] = useState(null);
  const [videoWaiting, setVideoWaiting] = useState(false)
  


  useEffect(()=>{
    GetSingleCourse(id)



    console.log(singleCourseData._id);
    
  }, [])



  const handleShowVideo = async(id)=>{
    console.log(id);

    
    const ab = await getInstructorLectures(id, singleCourseData._id)
    console.log(ab);
    
    setPlayedVideoInstructor(ab.signedUrl)
    
  }



  const handleLectureData = (id)=>{
    const recentData = singleCourseData?.lectures?.find((ab)=>{
      return ab._id === id;
    })
    setRecentLecture(recentData)

    console.log(recentData);
  }


  useEffect(()=>{
    console.log(formdata);
    
  },[formdata])
  
  

  const handleExistingForm = (lecture)=>{
    setFormdata(lecture)
    console.log(lecture);
    setNewFormOn(false)
    setFormOn(true); 
  }


  const handleAutoGet = ()=>{
    GetSingleCourse(id);
    setFormOn(false); 
    setNewFormOn(false)

  }



  const handleDeleteLect = async(lecture)=>{
    const confirmMSG = confirm(`Do you want to Delete ${lecture.title}??` );

    console.log(confirmMSG);
    
    if(confirmMSG){
      let ab = await deleteInstLect(lecture._id);
      if(ab){
        GetSingleCourse(id)
      }
    }

    
  }



  const handleVideoOnWaiting = ()=>{
    setVideoWaiting(true)
  }

  return (
    <div className='InstructorSingleCourseMainDiv'>
        <div className="InstructorSingleCoursePart1">
            <div className='partHeading'>
              <h2>Instructor Course</h2>
              <div className="headerButtons" onClick={()=>{setNewFormOn(true); setFormOn(false)}}>
                <ImageIcons icon={plusIcon} invert />
              </div>
            </div>

            <div className="videoMainDiv">
            <video 
            className='videoCourse ' 
            src={playedVideoInstructor}
            controls
            autoPlay
            onWaiting={()=>setVideoWaiting(true)}
            onPlaying={() => setVideoWaiting(false)} // remove class after pla
            poster={singleCourseData?.thumbnail}
            />

            {/* <div className="radar-parent accc"></div> */}

            {videoWaiting && (
              <div key={Date.now()} className="radar-parent accc"></div>
            )}
            </div>

            <div className="courseTitle">{singleCourseData?.title}</div>
            <div className="indtructorDetails">
              Instructor: {singleCourseData?.instructor?.name}
            </div>

            <div className="lectureDetialsFromServer">
              <div className="lectureSameDet lectureTitle">
                <p className="ttLect">Title</p>
                <p className="ttServeAns">{recentLecture?.title}</p>
              </div>
              <div className="lectureSameDet lectureNotes">
                <p className="ttLect">Notes</p>
                <p className="ttServeAns">{recentLecture?.notes}</p>
              </div>
              <div className="lectureSameDet lectureOrder">
                <p className="ttLect">Order/Serial</p>
                <p className="ttServeAns">{recentLecture?.order}</p>
              </div>
              <div className="lectureSameDet lectureType">
                <p className="ttLect">isFree</p>
                <p className="ttServeAns">{recentLecture?.isFree?"Free": recentLecture===null?"":"Paid"}</p>
              </div>
            </div>


            <div className="courseDesc">{singleCourseData?.description}</div>

           

        </div>


        <div className="LectureListCourse">
          <div className="lecturesLength">
            <p>Total Lectures</p>
            <p> {singleCourseData?.lectures?.length} Videos</p>
          </div>

{ singleCourseData && singleCourseData.lectures?.length > 0?
 singleCourseData.lectures?.sort((a,b)=> a.order - b.order).map((lecture, i)=>{
    
    return  <div className={activeList===i? "listCourse active":"listCourse"}  onClick={()=>setActiveList(i)} key={lecture._id}>
                <div className="lectures"  onClick={()=>{handleShowVideo(lecture._id); handleLectureData(lecture._id)}}>
                    <p className='lectureTitle' id={lecture.isFree? "freeLectures":""}>Class {lecture.order}</p>
                    <div className="lectureTT">{lecture.title}</div>
                </div>
                <div className='deleteLectBtn' onClick={()=>handleDeleteLect(lecture)}><ImageIcons icon={deleteIcon} invert/></div>
                <button className='editLectBtn' onClick={()=>handleExistingForm(lecture)}><LoadingController text="Edit"/></button>
            </div>
})
:
<p>No Lecture Found</p>
}


        </div>


        <div className={newformOn? "showNow":"notShow"} >
          <LectureForm/>
          <button className='cancelForm' onClick={()=>{handleAutoGet()}}>cancel</button>
        </div>



        <div className={formOn? "showNow":"notShow"} >
          <LectureForm  key={formdata?._id || "new"} existingData={formdata}/>
          <button className='cancelForm' onClick={()=>{handleAutoGet()}}>cancel</button>
        </div>

   
    </div>
  )
}

export default InstructorSingleCourse