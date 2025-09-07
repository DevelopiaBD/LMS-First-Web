const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // 
  ratings: {type: Number, default: 0},
  learningTags:[
    {
      type: String,
    }
  ],
  
  
  // 
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  instructor: {
    id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {type: String},
  },
  
  thumbnail: { type: String },
  thumbnailPublicId: { type: String },
  category: { type: String },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  isApproved: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Course  = mongoose.model('Course', courseSchema);
module.exports = Course
