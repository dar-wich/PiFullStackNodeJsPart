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

router.post('/addUser', function(req, res, next) {

 var user=new User(req.body);
  user.save().then(item => {
    console.log("data");
  })
  .catch(err => {
    console.log(err)
  });
      res.send("haha")
});

router.get('/getAllUsers', function(req, res, next) {

  User.find({},function(err,doc){
    res.send(doc)
  })
 });


 router.post('/removeUser', async function(req, res) {

   
    
  User.find({_id:req.body._id},function(err,doc){
      doc.forEach(element => {
    
        element.remove({})
      });
 
  })
res.send("j")
 
  });

module.exports = router;
