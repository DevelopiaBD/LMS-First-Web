// src/pages/course/CourseFormPage.jsx
import React, { useState, useEffect, useRef } from "react";
import "./CourseFormPage.css";
import searchIcon from "/svgs/magnifying-glass.svg";
import crossIcon from "/svgs/plus.svg";
import { UseDashBoardContextProvider } from "../../../Utils/DashBoardContext";
import TagInput from "../TagInput/TagInput ";

const CourseFormPage = () => {
  const { createCourse, getInstructorCourses, instructorCourses } = UseDashBoardContextProvider();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    ratings:"",
    learningTags:[],
    category: "",
    level: "Beginner",
    price: 0,
    thumbnail: null
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef();


  useEffect(()=>{
    getInstructorCourses()
  
  },[])

  // ------------------------------
  // Handle course search/select
  // ------------------------------
  
  const handleCourseSelect = (courseId) => {
    const course = instructorCourses.find(c => c._id === courseId);
    console.log(course);
    
    // if (!course) return;
    if(courseId==="newform"){
      setFormData({
        name: "",
        title: "",
        description: "",
        category: "",
        learningTags:[],
        ratings:"",
        level: "Beginner",
        price: 0,
        thumbnail: null
      });
      setSelectedCourse(course);
      setThumbnailPreview(null)
      return
    }

    setSelectedCourse(course);
    setFormData({
      name: course.instructor.name || "",
      title: course.title || "",
      description: course.description || "",
      learningTags: course.learningTags || "",
      ratings: course.ratings || "",
      category: course.category || "",
      level: course.level || "Beginner",
      price: course.price || 0,
      thumbnail: null
    });
    setThumbnailPreview(course.thumbnail || null);
  };

  // ------------------------------
  // Handle input changes
  // ------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ------------------------------
  // Handle file input
  // ------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, thumbnail: file }));
    setThumbnailPreview(URL.createObjectURL(file));

    
  };


  useEffect(()=>{
    console.log(thumbnailPreview);

  },[thumbnailPreview])

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setThumbnailPreview(null);
    fileInputRef.current.value = "";
  };


  useEffect(()=>{
    console.log(formData.learningTags);
    
  },[formData])

  // ------------------------------
  // Handle form submit
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ------------------------------
      // Create FormData object
      // ------------------------------
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("learningTags", formData.learningTags);
      payload.append("ratings", formData.ratings);
      payload.append("category", formData.category);
      payload.append("level", formData.level);
      payload.append("price", formData.price);

      if (formData.thumbnail) {
        payload.append("thumbnail", formData.thumbnail);
        
      }
      if (selectedCourse?._id) {
        payload.append("courseId", selectedCourse._id);
      }


      if(!formData.thumbnail){
        alert("Please Select A thumbline........")
        return 
      }
      // ------------------------------
      // Call context function to create/update course
      // ------------------------------
      const res = await createCourse(payload, selectedCourse?._id); // context function should accept FormData

      if(res?.success){
         setFormData({
          name: "",
          title: "",
          description: "",
          category: "",
          learningTags:[],
          ratings:"",
          level: "Beginner",
          price: 0,
          thumbnail: null
        });
        setThumbnailPreview(null);
        setSelectedCourse(null);
        fileInputRef.current.value = "";
      }
      
    //   if (res?.success) {
    //     alert(selectedCourse ? "Course updated successfully!" : "Course created successfully!");
    //     // Reset form
    //     setFormData({
    //       name: "",
    //       title: "",
    //       description: "",
    //       category: "",
    //       level: "Beginner",
    //       price: 0,
    //       thumbnail: null
    //     });
    //     setThumbnailPreview(null);
    //     setSelectedCourse(null);
    //     fileInputRef.current.value = "";
    //   } else {
    //     alert(res?.message || "Something went wrong.");
    //   }
    } catch (err) {
      console.error("Error submitting course:", err);
      alert("Failed to create/update course.");
    }
  };



  return (

    <div className="mainCourseFromStart">
      <div className="courseFormContainer">
      <div className="courseSearchDiv">
        <img src={searchIcon} alt="search" className="searchIcon" />
        <select
          className="courseSelect"
          onChange={(e) => handleCourseSelect(e.target.value)}
          value={selectedCourse?._id || ""}
          required
        >
          <option className="optionCourses" value="newform">+ New Course</option>
          {instructorCourses.map(course => (
            <option className="optionCourses" key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <form className="courseForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Instrucutor</label>
          <input
            type="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name of Instructor"
            required
          />
        </div>
        <div className="formGroup">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="formGroup decriptionInputTextarea">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter course description"
            rows={5}
          />
        </div>


       
{/* Newly Added........................................................................................... */}
{/* 
        <div className="formGroup">
          <label>Learning Points</label>
          <textarea
            name="learningTags"
            value={formData.learningTags}
            onChange={handleInputChange}
            placeholder="Enter Main Learnig Points with  ',' "
            rows={5}
          />
        </div> */}



        <div className="formGroup tagsForLearning">
          <label>Learning Points</label>
          <TagInput
            tags={formData.learningTags}
            setTags={(newTags) => setFormData(prev => ({ ...prev, learningTags: newTags }))}
            maxTags={6}
          />
        </div>




        <div className="formGroup">
          <label>Ratings</label>
          <input
            type="Number"
            name="ratings"
            value={formData.ratings}
            onChange={handleInputChange}
            placeholder="Enter Ratings"
            rows={5}
          />
        </div>


{/* Newly Added........................................................................................... */}















        <div className="formGroup">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter category"
          />
        </div>

        <div className="formGroup">
          <label>Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="formGroup">
          <label>Price (৳)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min={0}
          />
        </div>


        <button type="submit" className="submitButton">
          {selectedCourse ? "Update Course" : "Create Course"}
        </button>
      </form>
      </div>

      <div className="formGroup thumbnailGroup">
          <input
            type="file"
            accept="image/*"
            id="thimbline"
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />
          {/* {thumbnailPreview && ( */}
            <div className="thumbnailPreview">
              {
                thumbnailPreview? 
                <>
              <img src={thumbnailPreview} alt="preview" />
              <button className="crossButton" type="button" onClick={removeThumbnail}>
                <img src={crossIcon} alt="remove" />
              </button>
              </>
              :
              ""
            }
            </div>
            <label for="thimbline">Thumbnail</label>
          {/* )} */}
      </div>
    </div>
  );
};

export default CourseFormPage;
