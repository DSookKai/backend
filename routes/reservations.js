var express = require('express');
var router = express.Router();
const Reservation = require('../models/reservation.js')

/* GET users listing. */
router.get('/:date', function(req, res, next) {
  // date 에 해당하는 날짜, 시간의 예약 내역을 반환
  // Reservation.find({req.params.date}, (err, resv) => {
  //   res.json(resv);
  // }
  res.send(req.params.date)
});

module.exports = router;
