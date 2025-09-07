// controllers/lectureController.js

const Lecture = require("../model/LectureModel");
const Course = require("../model/CourseModel");
const User = require("../model/UserModel");
const Payment = require("../model/PaymentModel");
const { getSignedVideoUrl, getSignedMp4Url, cloudinary } = require("../utils/cloudinary"); // your existing function
const trush = require("../model/TrushModel");

// -------------------------
// Create Lecture Video
// -------------------------
const CreateLectureVideo = async (req, res) => {
  try {
    const { courseId, title, isFree, notes, order } = req.body;
    console.log(courseId);
    
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    // Extract publicId safely
    let publicId = req.file.filename;
    if (!publicId && req.file.path) {
      const parts = req.file.path.split("/");
      publicId = parts.slice(-1)[0].split(".")[0];
      if (parts.length > 2) {
        const folder = parts.slice(-2, -1)[0];
        publicId = `${folder}/${publicId}`;
      }
    }

    // Create lecture
    const lecture = await Lecture.create({
      title: title,
      videoPublicId: publicId,
      course: courseId,
      notes: notes,
      isFree: isFree,
      order: order? order : course.lectures.length + 1,
    });



    // Link lecture to course
    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json({
      message: "Lecture uploaded successfully",
      lecture: {
        _id: lecture._id,
        title: lecture.title,
        signedUrl: getSignedVideoUrl(lecture.videoPublicId), // HLS signed URL
        order: lecture.order,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};





const updateLectureVideo = async (req, res) => {
  try {
    const {title, isFree, notes, order } = req.body;

    const {lectureId} = req.params;

    const existingLecture = await Lecture.findById(lectureId);

    if(!existingLecture){
      return res.status(301).json({
        message:"The Lecture Is Not Available"
      })
    }

  
    existingLecture.title= title ;
    existingLecture.notes= notes ;
    existingLecture.isFree= isFree ;
    existingLecture.order= order ;
    await existingLecture.save();


    res.status(201).json({
      message: "Lecture Updated successfully",
      success: true
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Lecture Update Server failed", error: err.message, success: false });
  }
};




// -------------------------
// Delete Lecture Video
// -------------------------
const deleteLectureVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLecture = await Lecture.findById(id);

 // 2. শুধু ভিডিও ফাইল হলে Trush-এ যোগ করা হবে
    if (existingLecture.videoPublicId) {
      const urlIds = [existingLecture.videoPublicId];
      const existTrush = await trush.find();

      if (existTrush.length === 0) {
        await trush.create({ lecturesVideos: urlIds });
      } else {
        existTrush[0].lecturesVideos.push(...urlIds);
        await existTrush[0].save();
      }
    }
    
    // return

    if (!existingLecture) {
      return res.status(404).json({
        message: "Lecture Not Found",
        success: false
      });
    }


    // Remove lecture reference from course
    const updateCourse = await Course.findByIdAndUpdate(
      existingLecture.course,          // course id is stored in lecture
      { $pull: { lectures: id } },     // remove lecture id from lectures array
      { new: true }                    // return updated course
    );
    

    // Delete lecture itself
    const deleteLecture = await Lecture.findByIdAndDelete(id);

    res.status(200).json({
      message: "Lecture deleted successfully",
      success: true,
      updatedCourse: updateCourse,
      deletedLecture: deleteLecture
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      message: "Lecture delete server failed",
      error: err.message,
      success: false
    });
  }
};


const deleteTrushVideos = async (req, res) => {
  try {
    const trushDocs = await trush.find();

    for (const doc of trushDocs) {
      // lecturesVideos এর কপি করে রাখছি যাতে loop safe থাকে
      const publicIds = [...doc.lecturesVideos];

      for (const publicId of publicIds) {
        try {
          
          // 1. Cloudinary থেকে ডিলিট
          const result = await cloudinary.uploader.destroy(publicId, { 
            resource_type: "video",
            type: "authenticated"   // 🔑 এটি যোগ করতে হবে
          });


          if (result.result === "ok") {
            console.log("✅ Deleted from Cloudinary:", publicId);

            // 2. DB থেকে মুছো
            doc.lecturesVideos = doc.lecturesVideos.filter(id => id !== publicId);
            await doc.save();

            console.log("✅ Deleted from DB:", publicId);
          } else {
            console.error("❌ Cloudinary delete failed:", publicId, result);
            return res.status(500).json({
              message: `Cloudinary delete failed for ${publicId}`,
              success: false
            });
          }
        } catch (innerErr) {
          console.error("❌ Error deleting video:", publicId, innerErr);
          return res.status(500).json({
            message: `Error deleting ${publicId}`,
            error: innerErr.message,
            success: false
          });
        }
      }
    }

    res.json({
      message: "All trash videos deleted successfully",
      success: true
    });

  } catch (err) {
    console.error("Delete Trush error:", err);
    res.status(500).json({
      message: "Trush delete server failed",
      error: err.message,
      success: false
    });
  }
};









// -------------------------
// Get Signed Video URL (HLS) for a Lecture
// -------------------------
const getSignedVideoUrlUserLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const courseId = req.params.courseid;
    const userId = req.user ? req.user.id : null; // optionalAuth থাকায় guest handle করবে
    console.log(req.user);
    

    const lecture = await Lecture.findById(lectureId).populate("course");

    
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }


    if(req.user?.role==="instructor"){
      const signedUrl = getSignedVideoUrl(lecture.videoPublicId);
      return res.status(200).json({ signedUrl, message:"You are in as a Instructor", fullAccess: true});

    }


    // ✅ যদি ফ্রি লেকচার হয় → guest সহ সবার জন্য
    if (lecture.isFree ) {
      const signedUrl = getSignedVideoUrl(lecture.videoPublicId);
      return res.status(200).json({ signedUrl});

    }

    // ✅ পেইড লেকচারের জন্য পেমেন্ট চেক
    if (!userId) {
      return res.status(401).json({ message: "Login required to view this lecture" });
    }

    const hasPaid = await Payment.exists({ student: userId, course: courseId });

    if (!hasPaid) {
      return res.status(403).json({ message: "This lecture is locked. Purchase the course to view." });
    }

    const signedUrl = getSignedVideoUrl(lecture.videoPublicId);
    res.json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ message: "Error generating signed URL", error: error.message });
  }
};




const getLecturesForInstructor = async (req, res) => {
  try {
    const { lectureId, courseId} = req.params;
 // assuming you pass both lectureId & courseId in route
    const userId = req.user.id;                       // from auth middleware

    // 1. Verify User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid User" });
    }

    // 2. Verify Course exists & belongs to this instructor
    const course = await Course.findOne({ _id: courseId, "instructor.id": userId });
    if (!course) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    // 3. Verify Lecture exists & belongs to this course
    const lecture = await Lecture.findOne({ _id: lectureId, course: courseId });
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found in this course" });
    }

    // 4. Generate signed MP4 URL
    const signedUrl = getSignedMp4Url(lecture.videoPublicId);

    return res.json({
      signedUrl,
      message: "Lecture access granted",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error in getting Lectures for Instructor",
    });
  }
};



module.exports = {
  CreateLectureVideo,
  updateLectureVideo,
  deleteLectureVideo,
  deleteTrushVideos,


  getSignedVideoUrlUserLecture,
  getLecturesForInstructor,
};
