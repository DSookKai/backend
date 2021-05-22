const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  place: String,
  date: Date,
});

module.exports = mongoose.model('Reservation', reservationSchema);
