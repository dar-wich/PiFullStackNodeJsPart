var express = require('express');
var router = express.Router();
// const translate = require('@k3rn31p4nic/google-translate-api');

/* GET home page. */
router.get('/', function(req, res, next) {
          var spawn = require("child_process").spawn; 
        spawn('python',["./public/twitter.py"] );
  res.send("message");
});

module.exports = router;
