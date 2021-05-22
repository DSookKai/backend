const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  phoneNum: String,
  verifyCode: String
});

module.exports = mongoose.model('Certification', certificationSchema);
