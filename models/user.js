const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: String,
  acceptedInfo: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
  phoneNum: String,
  guardianPhoneNum: String,
  birth: String,
  location: String,
});

module.exports = mongoose.model('User', userSchema);
