const mongoose = require('mongoose');

export const status = {
  beforeBoarding: 1, // 출발 전
  onBoard: 2, // 탑승 완료
  arrivedCourseAttraction: 3, // 남산타워 도착 
  arrivedHome: 4, // 하차 완료
  noShow: 5 // 노쇼
}

const courseSchema = new mongoose.Schema({
  _id: String,
  date: String,
  userInfo: { 
    type: [
      {userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
      companion: Number, status: Number}],
    "default": []},
    
  courseName: { type: String, "default": "남산타워"},
  courseTime: { type: String, "default": "14"},
  carNumber: { type: String, "default": "24구 2028"}
});

module.exports = mongoose.model('Course', courseSchema);