var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user.js')
const Course = require('../models/course.js')
const TravelerInfo = require('../models/travelerInfo.js')
const Utils = require('../utils/push.js')

const { sendPush, status, message } = Utils

router.get('/travelerInfo', async (req, res) => {
  const result = await TravelerInfo.find().exec()
  res.json(result)
})

router.post('/travelerInfo', async (req, res) => {
  const { userIds, courseId } = req.body
  const filter = {courseId, userId: { "$in": userIds}}
  const populatedTravelerInfos = await TravelerInfo.find(filter).populate('userId').exec()
  const result = populatedTravelerInfos.map(data => {
    return {
      userName: data.userId.userName,
      companion: data.companion,
      location: data.userId.location,
    }
  })

  res.json(result);
})

router.get('/travelerInfo/:travelerInfoId', async (req, res) => {
  const result = await TravelerInfo.findById(req.params.travelerInfoId).exec()
  res.json(result)
})

// 운행 시작
router.get('/start/:courseId', async (req, res) => {
  const filter = {courseId: req.params.courseId}
  const update = {"$set": {status: status.start}}
  await TravelerInfo.updateMany(filter, update, {new: true})
  res.send("success");
})

// 어르신 탑승
router.get('/board/:courseId/:id', async (req, res) => {
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.onBoard}}

  const user = await User.findById(req.params.id).exec()
  const course = await Course.findById(req.params.courseId).exec()
  const message = Utils.message(status.onBoard, user, course)
  sendPush(message, user.guardianDeviceToken)
  console.log(message)
  
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


router.get('/push', async (req, res) => {
  const result = await Utils.sendPush('신기하다')
  res.send(result)
})


// 어르신 하차
router.get('/arrive-home/:courseId/:id', async (req, res) => {
  const filter = {courseId: req.params.courseId, userId: req.params.id}
  const update = {"$set": {status: status.arrivedHome}}
  let result = await TravelerInfo.findOneAndUpdate(filter, update, {new: true})
  
  const user = await User.findById(req.params.id).exec()
  const course = await Course.findById(req.params.courseId).exec()
  const message = Utils.message(status.onBoard, user, course)
  sendPush(message, user.guardianDeviceToken)
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