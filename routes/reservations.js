var express = require('express');
var router = express.Router();

"use strict";

const User = require('../models/user.js')
const Course = require('../models/course.js')
const TravelerInfo = require('../models/travelerInfo.js')

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '6474e879de8f48cc94417ab7b6252983';
const endpoint = 'https://pikurate.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

async function entityRecognition(entityInputs, client){
  const entityResults = await client.recognizeEntities(entityInputs, "ko");
  return entityResults[0].entities;
};

/* GET courses listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 희망하는 날짜 추출 및 해당 날짜의 일정 return
router.post('/date', async function(req, res, next) {
  var text = req.body.text;
  const entityInputs = [
    text
  ];
  var entities = await entityRecognition(entityInputs, textAnalyticsClient);

  var dateNum = "2021";
  entities.forEach(entity => {
    if (entity.category=="Quantity") {
      switch(entity.subCategory){
        case "Number":
          if (entity.text.length == 1) {
            dateNum += "0";
          }
          dateNum += entity.text;
        case "Ordinal":
          dateNum += entity.text.substring(0,entity.text.length-1);
      }
    }
  }); 
  
  const dayCourses = await Course.find({date: dateNum}).exec();
  var result = {"date": dateNum, "place":dayCourses[0].courseName, "course": dayCourses};
  res.send(result);
  res.end();
});

// 희망 시간 추출
router.post('/time', async function(req, res, next) {
  var text = req.body.text;
  const entityInputs = [
    text
  ];
  var entities = await entityRecognition(entityInputs, textAnalyticsClient);

  var hour = 0;
  var time = "";
  if (text.indexOf("오후") != -1){
    hour += 12;
  } 
  entities.forEach(entity => {
    if (entity.category=="Quantity" & entity.subCategory=="Number") {
      var hourNum = entity.text *1;
      hour += hourNum;
      var hourStr = hour + "";
      if (hourStr == 1){
        time += "0";
        time += hourStr;
      }else{
        time += hourStr;
      }
    }
  });
  
  var result = {"time": time};
  res.send(result);
  res.end();
});

// 동행자 명수 추출
router.post('/companion', async function(req, res, next) {
  var text = req.body.text;
  const entityInputs = [
    text
  ];
  var entities = await entityRecognition(entityInputs, textAnalyticsClient);

  var companion = 1;
  entities.forEach(entity => {
    if (entity.category=="Quantity" & entity.subCategory=="Number") {
      companion += entity.text*1 -1;
    }
  });
  
  var result = {"companion": companion};
  res.send(result);
  res.end();
});

//해당 예약 저장
router.post('/confirm', async function(req, res, next) {
  var text = req.body.text;
  var info = req.body.reservation;
  const answerArray = ["응", "네", "좋아", "해줘", "그래", "오키"];

  if (answerArray.includes(text)) {
    const {phoneNumber, companion, place, date, time} = info

    const targetUser = await User.findOne({phoneNum: phoneNumber}).exec();
    const targetCourse = await Course.findOne({courseName: place}).exec();

    const userId = targetUser._id;
    const courseId = targetCourse._id;
    let travelerInfo = new TravelerInfo({
      userId, companion, courseId, status: 1
    })
  
    await travelerInfo.save();
  
    const u_filter = { _id: userId}
    const u_update = { "$push": {acceptedInfo: courseId}}
  
    // 유저 업데이트
    await User.findOneAndUpdate(u_filter, u_update)
  
    const c_filter = { _id: courseId }
    const c_update = { "$push": {travelerInfo: travelerInfo._id} }
  
    // 코스 업데이트
    await Course.findOneAndUpdate(c_filter, c_update)
  
    res.send("success");
  }else{
    res.send("fail");
  }
  res.end();
});

//완료된 예약 조회
router.post('/list', async function(req, res, next) {
  var phoneNumber = req.body.phoneNumber;
  const targetUser = await User.findOne({phoneNum: phoneNumber}).exec();
  const targetUserId = targetUser._id;

  const reservations = await TravelerInfo.find({userId: targetUserId}).exec();
  var reservationList = new Array();

  const reservationInfo = async (reservation) => {
    var resv = new Object();
    resv.companion = reservation.companion;
    
    var courseId = reservation.courseId;
    var targetCourse = await Course.findOne({_id:courseId}).exec();
    resv.place = targetCourse.courseName;
    resv.date = targetCourse.date;
    resv.time = targetCourse.courseTime;
    reservationList.push(resv);
  }
  
  reservations.forEach(reservation => {
    reservationInfo(reservation);
  });

  res.send({reservations: reservationList});
  res.end();
});

module.exports = router;
