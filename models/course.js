const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
  date: String,
  travelerInfo: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'TravelerInfo'
  }],
  courseName: { type: String, "default": "남산타워"},
  courseTime: { type: String, "default": "14"},
  carNumber: { type: String, "default": "24구 2028"}
});

module.exports = mongoose.model('Course', courseSchema);