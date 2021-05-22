const mongoose = require('mongoose');
const travelerInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
  companion: Number,
  status: Number,
});

module.exports = mongoose.model('TravelerInfo', travelerInfoSchema);