var express = require('express');
var router = express.Router();

const User = require('../models/user.js')
const Course = require('../models/course.js')
const TravelerInfo = require('../models/travelerInfo.js')

const status = {
  beforeBoarding: 1, // 출발 전
  onBoard: 2, // 탑승 완료
  arrivedCourseAttraction: 3, // 남산타워 도착 
  arrivedHome: 4, // 하차 완료
  noShow: 5, // 노쇼
  end: 6, // 여행 일정 모두 종료 
}

// 특정 코스에 참여하신 어르신 조회
router.get('/:courseId', async (req, res) => {
  const result = await User.find({acceptedInfo: req.params.courseId})
  res.json(result)
})

router.get('/travelerInfo', async (req, res) => {
  const result = await TravelerInfo.find({})
  res.json(result)
})

router.get('/travelerInfo/:travelerInfoId', async (req, res) => {
  const result = await TravelerInfo.findById(req.params.travelerInfoId)
  res.json(result)
})




// 운행 시작
router.get('/start/:courseId', async (req, res) => {
  // const filter = 
  // TravelerInfo.findAndUpdate({})
})

// 어르신 탑승
router.get('/board/:courseId/:id', async (req, res) => {
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.onBoard}}

  let result = await TravelerInfo.findOneAndUpdate(filter, update, {new: true})
  res.send(result);
})

// 목적지 도착
router.get('/attraction/:courseId/:id', async (req, res) => {
  
})

// 어르신 하차
router.get('/arrive-home/:courseId/:id', async (req, res) => {
  
})

// 어르신 노쇼
router.get('/no-show/:courseId/:id', async (req, res) => {
  
})

// 운행 종료
router.get('/end/:courseId', async (req, res) => {
  
})

module.exports = router;