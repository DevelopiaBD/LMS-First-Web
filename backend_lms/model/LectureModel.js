const mongoose = require('mongoose');



const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoPublicId: { type: String, required: true }, // NEW FIELD
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  notes: { type: String },
  order: { type: Number },
  isFree: { type: Boolean, default: false }, // <-- new field
  createdAt: { type: Date, default: Date.now }
});


const Lecture  = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;








