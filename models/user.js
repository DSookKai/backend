const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: String,
  acceptedInfo: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
  phoneNum: String,
  guardianPhoneNum: String,
  birth: String,
  location: String,
  deviceToken: String,
  guardianDeviceToken: {type: String, default: process.env.DEVICE_TOKEN},
});

// 보호자와 유저 각각에 대해 deviceId 받아야함

module.exports = mongoose.model('User', userSchema);
