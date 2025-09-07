import React, { useState, useEffect } from "react";
import "./LectureForm.css";
import { UseDashBoardContextProvider } from "../../../../Utils/DashBoardContext";
import LoadingController from "../../../LoadingController/LoadingController";

const LectureForm = ({ existingData = null }) => {
  const { instructorCourses, createLecture, loadingFormLecture } = UseDashBoardContextProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [courseLectureLength, setCourseLectureLength] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    notes: "",
    order: "",
    isFree: false,
    video: null,
    videoPreview: null,
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData?.title || "",
        notes: existingData?.notes || "",
        order: existingData?.order || "",
        isFree: existingData?.isFree || false,
        video: null,
        videoPreview: null,
        courseId: existingData?.courseId || "",
      });
    } else if (courseLectureLength !== null) {
      setFormData((prev) => ({
        ...prev,
        order: courseLectureLength + 1,
      }));
    }
  }, [existingData, courseLectureLength]);

  useEffect(() => {
    console.log(formData);
    console.log(existingData?._id);
  }, [formData, existingData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        video: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
    console.log(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingData?._id) {
        const payload = {
          title: formData.title,
          notes: formData.notes,
          isFree: formData.isFree,
          order: formData.order,
        };

        const result = await createLecture(payload, existingData._id);
        if (result) {
          setSuccess(true);
          setError(false);
        } else {
          setSuccess(false);
          setError(true);
        }
        return;
      } else {
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("courseId", formData.courseId);
        fd.append("notes", formData.notes);
        fd.append("isFree", formData.isFree);
        if (formData.video) fd.append("video", formData.video);

        const result = await createLecture(fd);
        if (result) {
          setSuccess(true);
          setError(false);
        } else {
          setSuccess(false);
          setError(true);
        }
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseLecture = (courseId) => {
    const ab = instructorCourses.find((a) => a._id === courseId);
    if (ab) setCourseLectureLength(ab.lectures.length);
  };

  useEffect(() => {
    console.log(instructorCourses);
  }, []);

  return (
    <div className="lecture-form-container">
      <h2>Create Lecture</h2>
      <form onSubmit={handleSubmit}>
        <label>Lecture Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label style={{ display: existingData?.title ? "none" : "" }}>Select Course</label>
        <div className="course-select-wrapper" style={{ display: existingData?.title ? "none" : "" }}>
          <select
            value={formData.courseId}
            name="courseId"
            onChange={(e) => {
              handleChange(e);
              handleCourseLecture(e.target.value);
            }}
            required={!existingData?.title}
          >
            <option value="">-- Select Course --</option>
            {instructorCourses?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          {formData.courseId && (
            <img
              className="course-thumbnail-preview"
              src={instructorCourses.find((c) => c._id === formData.courseId)?.thumbnail}
              alt="course thumbnail"
            />
          )}
        </div>

        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" />

        <label>Order</label>
        <input type="Number" name="order" value={formData.order} onChange={handleChange} />

        <div className="checkbox-group">
          <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} />
          <label>Free Lecture?</label>
        </div>

        <label style={{ display: existingData?._id ? "none" : "" }}>Upload Video</label>
        <div
          className="video-upload"
          onClick={() => document.getElementById("videoInput").click()}
          style={{ display: existingData?._id ? "none" : "" }}
        >
          <input
            type="file"
            id="videoInput"
            accept="video/*"
            onChange={handleVideoChange}
            style={{ display: "none" }}
          />
          {formData.videoPreview ? (
            <video src={formData.videoPreview} controls className="videoShowing" />
          ) : (
            <p>Click to select a video</p>
          )}
        </div>

        <button type="submit">
          <LoadingController
            load={loading}
            success={success}
            error={error}
            text={existingData?._id ? "Update Data" : "Create Lecture"}
          />
        </button>
      </form>
    </div>
  );
};

export default LectureForm;
