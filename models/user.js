const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  userName: String,
  acceptedInfo: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
  phoneNum: String,
  guardians: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  birth: String,
  location: String,
  isGuardian: Boolean,
  seniors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('User', userSchema);
