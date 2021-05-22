var express = require('express');
var router = express.Router();

const Users = require('../models/user.js')
const ObjectId = require('mongoose').Types.ObjectId; 


// 모든 유저 조회
router.get('/', async (req, res, next) => {
  const result = await Users.find().exec()
  res.json(result)
});

// 유저 id로 조회
router.get('/:id', async (req, res, next) => {
  const result = await Users.findById(req.params.id).exec()
  res.json(result)
})

router.post('/register', (req, res, next) => {
  
  
})


module.exports = router;
