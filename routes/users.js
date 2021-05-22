var express = require('express');
var router = express.Router();

const User = require('../models/user.js')
const Course = require('../models/course.js')
const TravelerInfo = require('../models/travelerInfo.js')
const Certification = require('../models/certification.js')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

// 모든 유저 조회
router.get('/', async (req, res, next) => {
  const result = await User.find().exec()
  res.json(result)
});

// id로 어르신 조회
router.get('/id/:id', async (req, res, next) => {
  const result = await User.findById(req.params.id).exec()
  res.json(result)
})

// 핸드폰 번호로 어르신 조회
router.get('/phone-num/:phoneNum', async (req, res) => {
  const result = await User.findOne({phoneNum: req.params.phoneNum}).exec()
  res.json(result)
})

// 보호자 핸드폰 번호로 어르신 조회 (여러 명일 수 있음)
router.get('/guardian-phone-num/:guardianPhoneNum', async (req, res) => {
  const result = await User.find({guardianPhoneNum: req.params.guardianPhoneNum}).exec()
  res.json(result)
})

// 회원가입
router.post('/register', (req, res, next) => {
  const { userName, phoneNum, birth, location, guardianPhoneNum} = req.body
  const user = new User({
    userName, phoneNum, birth, location, guardianPhoneNum
  })

  user.save()
  .then(data => { res.send(data); }) 
  .catch(err => { 
    res.status(500).send({ message: err.message || 'Register failure.' }); 
  });
})


// 코스에 참여
router.post('/join', async (req, res, next) => {
  const {userId, companion, courseId} = req.body

  let duplicate = await TravelerInfo.find({userId, courseId}).exec()
  console.warn(duplicate)
  if (duplicate && duplicate.length > 0)
  {
    console.error("cannot join twice")
    res.send("cannot join twice")
    return;
  }

  let travelerInfo = new TravelerInfo({
    userId, companion, courseId
  })

  await travelerInfo.save();
  // console.log(travelerInfo)

  const u_filter = { _id: userId}
  const u_update = { "$push": {acceptedInfo: courseId}}

  // 유저 업데이트
  await User.findOneAndUpdate(u_filter, u_update)

  const c_filter = { _id: courseId }
  const c_update = { "$push": {travelerInfo: travelerInfo._id} }

  // 코스 업데이트
  await Course.findOneAndUpdate(c_filter, c_update)

  res.send("success")
})

// 특정 코스에 참여하신 어르신 조회
router.get('/course/:courseId', async (req, res) => {
  const result = await User.find({acceptedInfo: req.params.courseId}).exec()
  res.json(result)
})

// SMS 인증
router.get('/sms/:phoneNum', async function(req, res, next) {
  var phoneNumber = req.params.phoneNum;

  let verifyCode;
  for (let i = 0; i < 6; i++) {
    verifyCode += parseInt(Math.random() * 10);
  }

  const certification = new Certification({
    phoneNumber, verifyCode
  })

  //발송
  console.log("발송");

  certification.save()
  .then(data => { res.send(data); }) 
  .catch(err => { 
    res.status(500).send({ message: err.message || 'Certification failure.' }); 
  });
})

// SMS 인증 확인
router.post('/sms/confirm', async function(req, res, next) {
  var phoneNumber = req.body.phoneNumber;
  var code = req.body.code;

  const targetCode = await Certification.findOne({phoneNumber: phoneNumber}).exec();
  if (targetCode.verifyCode == code) {
    res.send("success");
  }else{
    res.send("fail");
  }
})


module.exports = router;
