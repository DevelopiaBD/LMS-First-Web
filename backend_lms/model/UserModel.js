const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true},
  profileImg: { type: String },
  profileImageId:{ type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  enrolledCourses: [
    {
      courseId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      completed: {type: Number, default: 0},
      _id:false

    }
  ],
  limit:{ type: Number, default: 5 }, // Limit for courses a user can enroll in
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


module.exports = User
