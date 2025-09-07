import React from 'react';
import { useParams } from 'react-router-dom';
import "./SingleCoursePage.css"
import VideoPlayAndDetails from '../VideoPlayAndDetails/VideoPlayAndDetails';

import Footer from '../Footer/Footer';
import { useApiContext } from '../../../../Utils/ApiContext';
import { useEffect } from 'react';
import PopularCourses from '../PopularCourses/PopularCourses';









const SingleCoursePage = () => {

  const {courseData, singleCourseData, GetSingleCourse} = useApiContext();


  const {id} = useParams(); // Assuming you are using react-router-dom to get the course ID from the URL
  console.log(courseData); // This will log the course ID to the console for debugging purposes
  
  useEffect(()=>{
    GetSingleCourse(id)
    
  },[])
  
  console.log(singleCourseData);

  return (
    <div className='container SingleCoursePageContainer'>
             {/*Course video and pricing */}


            <VideoPlayAndDetails />


        <div className="courseSectionTwo" style={{marginTop:"100px"}}>{/*Course Description */}
            <h2 style={{marginBottom:"20px"}}>Course Description</h2>
            <p>
               এই ডিজিটাল মার্কেটিং কোর্সে আপনি শিখবেন কীভাবে অনলাইনে ব্র্যান্ড প্রচার,  
          গ্রাহক আকর্ষণ এবং বিক্রয় বৃদ্ধি করা যায়।  

          কোর্সটিতে অন্তর্ভুক্ত রয়েছে সোশ্যাল মিডিয়া মার্কেটিং,  
          সার্চ ইঞ্জিন অপটিমাইজেশন (SEO), গুগল অ্যাডস, ফেসবুক অ্যাডস,  
          কনটেন্ট মার্কেটিং, ইমেইল মার্কেটিং এবং এনালিটিক্স টুলস ব্যবহারের পূর্ণাঙ্গ গাইড।  

          শুরু থেকে উন্নত পর্যায় পর্যন্ত সাজানো এই কোর্সটি আপনাকে ডিজিটাল প্ল্যাটফর্মে  
          ব্যবসা সফলভাবে পরিচালনা করার জন্য প্রয়োজনীয় দক্ষতা এবং কৌশল শিখাবে।  

          যেকোনো শিক্ষার্থী, উদ্যোক্তা, বা ফ্রিল্যান্সার এই কোর্স থেকে উপকৃত হবেন।  

            </p>


          <div className='links'></div>
        </div>




        <div className="relatedCourse">
            <h1>Related Courses</h1>
            <p style={{marginBottom:"30px"}}>Explore more courses related to this one</p>
            <PopularCourses/>
        </div>

        <Footer/>
    </div>

  )
}

export default SingleCoursePage