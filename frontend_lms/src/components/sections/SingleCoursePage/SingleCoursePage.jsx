import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./SingleCoursePage.css";

import VideoPlayAndDetails from '../VideoPlayAndDetails/VideoPlayAndDetails';
import Footer from '../Footer/Footer';
import PopularCourses from '../PopularCourses/PopularCourses';
import { useApiContext } from '../../../../Utils/ApiContext';
import LoadingAnim from '../../LoadingAnim';
import ErrorIndicates from '../../ErrorIndicates';

const SingleCoursePage = () => {
  const { 
    courseData,
    singleCourseData, 
    GetSingleCourse, 

    ApiLoading,
    ApiError
  } = useApiContext();
  const { id } = useParams();

  // Fetch course data
  useEffect(() => {
    GetSingleCourse(id);
  }, [id]);

  console.log("All Courses:", courseData);
  console.log("Single Course:", singleCourseData);


  let ab = false;
  // setTimeout(() => {
  //   ab= true;
  // }, 1000);
  
  if(ApiLoading){
    return <LoadingAnim/>
  }



  if(singleCourseData.length===0){
    // return <LoadingAnim/>
    return (
      <div className="mainErrorshow" style={{height:"100vh", display:"flex", alignItems:"center"}}>
        <h1>No Course Found Yet!!!!</h1>
      </div>
    )
  }



  if(ApiError){
    return <ErrorIndicates/>
  }



  return (
    <div className="single-course-page-wrapper">
      
      {/* Video + details section */}
      <section className="single-course-video-section">
        <VideoPlayAndDetails />
      </section>

      {/* Course Description */}
      <section className="single-course-description-section">
        <h2 className="single-course-description-title">Course Description</h2>
        <p className="single-course-description-text">
          এই ডিজিটাল মার্কেটিং কোর্সে আপনি শিখবেন কীভাবে অনলাইনে ব্র্যান্ড প্রচার,  
          গ্রাহক আকর্ষণ এবং বিক্রয় বৃদ্ধি করা যায়।  

          কোর্সটিতে অন্তর্ভুক্ত রয়েছে সোশ্যাল মিডিয়া মার্কেটিং,  
          সার্চ ইঞ্জিন অপটিমাইজেশন (SEO), গুগল অ্যাডস, ফেসবুক অ্যাডস,  
          কনটেন্ট মার্কেটিং, ইমেইল মার্কেটিং এবং এনালিটিক্স টুলস ব্যবহারের পূর্ণাঙ্গ গাইড।  

          শুরু থেকে উন্নত পর্যায় পর্যন্ত সাজানো এই কোর্সটি আপনাকে ডিজিটাল প্ল্যাটফর্মে  
          ব্যবসা সফলভাবে পরিচালনা করার জন্য প্রয়োজনীয় দক্ষতা এবং কৌশল শিখাবে।  

          যেকোনো শিক্ষার্থী, উদ্যোক্তা, বা ফ্রিল্যান্সার এই কোর্স থেকে উপকৃত হবেন।  
        </p>
      </section>

      {/* Related Courses */}
      <section className="single-course-related-section">
        <h1 className="single-course-related-title">Related Courses</h1>
        <p className="single-course-related-subtitle">
          Explore more courses related to this one
        </p>
        <PopularCourses />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SingleCoursePage;
