var express = require('express');
var router = express.Router();
const User = require('../models/User');
/* GET users listing. */
router.get('/login', function(req, res, next) {

  User.findOne({ $and: [ { password: req.query.password }, { login: req.query.email } ]},function(err,doc){
    console.log(doc)
    if(doc!=null)
    res.send(doc);
    else 
    res.send([])
  })
  
});

module.exports = router;
