var express = require('express');
var router = express.Router();
const Course = require('../models/course.js')

// 모든 course 조회
router.get('/', async (req, res, next) => {
  const result = await Course.find().exec()
  res.json(result)
});

// 특정 course 조회
router.get('/:courseId', async (req, res) => {
  const result = await Course.findOne({_id: req.params.courseId})
  res.json(result)
})

router.post('/create', async (req, res) => {
  const { date, courseName, courseTime } = req.body
  let course = new Course({
    date, courseName, courseTime
  })
  await course.save();
  res.send(course)
})

module.exports = router;
