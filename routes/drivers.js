var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user.js')
const Course = require('../models/course.js')
const TravelerInfo = require('../models/travelerInfo.js')

const status = {
  beforeStart: 0, // 운행 시작 전
  start: 1, // 운행 시작
  onBoard: 2, // 탑승 완료
  arrivedCourseAttraction: 3, // 남산타워 도착 
  arrivedHome: 4, // 하차 완료
  noShow: 5, // 노쇼
  end: 6, // 여행 일정 모두 종료 
}


router.get('/travelerInfo', async (req, res) => {
  const result = await TravelerInfo.find().exec()
  res.json(result)
})

router.get('/travelerInfo/:travelerInfoId', async (req, res) => {
  const result = await TravelerInfo.findById(req.params.travelerInfoId).exec()
  res.json(result)
})

// 운행 시작
router.get('/start/:courseId', async (req, res) => {
  const filter = {courseId: req.params.courseId}
  const update = {"$set": {status: status.start}}

  let result = await TravelerInfo.findAndUpdate(filter, update, {new: true})
  res.send(result);
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
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.arrivedCourseAttraction}}

  let result = await TravelerInfo.findOneAndUpdate(filter, update, {new: true})
  res.send(result);
})

// 어르신 하차
router.get('/arrive-home/:courseId/:id', async (req, res) => {
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.arrivedHome}}

  let result = await TravelerInfo.findOneAndUpdate(filter, update, {new: true})
  res.send(result);
})

// 어르신 노쇼
router.get('/no-show/:courseId/:id', async (req, res) => {
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.noShow}}

  let result = await TravelerInfo.findOneAndUpdate(filter, update, {new: true})
  res.send(result);

})

// 운행 종료
router.get('/end/:courseId', async (req, res) => {
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.end}}

  let result = await TravelerInfo.findOneAndUpdate(filter, update, {new: true})
  res.send(result);

})

module.exports = router;