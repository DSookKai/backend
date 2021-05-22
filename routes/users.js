var express = require('express');
var router = express.Router();

const Users = require('../models/user.js')
const ObjectId = require('mongoose').Types.ObjectId; 


// id로 유저 조회
router.get('/:id', function(req, res, next) {
  // res.send(req.params.id)
  // Users.findOne({_id: new ObjectId(req.params.id)})
  Users.findById(req.params.id)
  .then(user => 
    res.json(user))  
});

router.post('/register', (req, res, next) => {
  
  
})


module.exports = router;
