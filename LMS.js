
// -------------------------------
// ✅ 1. User Model (Student, Instructor, Admin)
// -------------------------------
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);



// -------------------------------
// ✅ 2. Course Model
// -------------------------------



const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  category: { type: String },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  isApproved: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Course', courseSchema);



// -------------------------------
// ✅ 3. Lecture Model
// -------------------------------
const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  notes: { type: String },
  order: { type: Number },
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Lecture', lectureSchema);



// -------------------------------
// ✅ 4. Quiz Model
// -------------------------------
const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],
  duration: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);



// -------------------------------
// ✅ 5. Result Model (Quiz submissions)
// -------------------------------
const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [Number],
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);



// -------------------------------
// ✅ 6. Assignment Model
// -------------------------------
const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  deadline: Date,
  uploadType: { type: String, enum: ['pdf', 'image'], default: 'pdf' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);



// -------------------------------
// ✅ 7. Submission Model (for assignments)
// -------------------------------
const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: String,
  feedback: String,
  grade: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);



// -------------------------------
// ✅ 8. Payment Model
// -------------------------------
const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);



// -------------------------------
// ✅ 9. Certificate Model
// -------------------------------
const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  certificateUrl: String,
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);



// -------------------------------
// ✅ 10. Notification Model
// -------------------------------
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);



import express from "express";
import { upload, getSignedVideoUrl } from "../utils/cloudinaryUpload.js";
import Lecture from "../models/Lecture.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Upload a lecture video
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    const { title, courseId } = req.body;

    const lecture = await Lecture.create({
      title,
      videoPublicId: req.file.filename || req.file.public_id, // public_id from Cloudinary
      course: courseId
    });

    res.json({
      message: "Video uploaded successfully",
      lecture
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Get signed video URL for playback
router.get("/:lectureId/video", auth, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const signedUrl = getSignedVideoUrl(lecture.videoPublicId);
    res.json({ videoUrl: signedUrl });
  } catch (err) {
    res.status(500).json({ message: "Failed to get video", error: err.message });
  }
});

export default router;

