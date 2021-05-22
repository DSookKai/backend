const mongoose = require('mongoose');
const travelerInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
  companion: {type: Number, "default": 0},
  status: {type: Number, "default": 0},
});

module.exports = mongoose.model('TravelerInfo', travelerInfoSchema);