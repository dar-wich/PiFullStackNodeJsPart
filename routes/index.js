var express = require('express');
var router = express.Router();
const translate = require('@k3rn31p4nic/google-translate-api');

/* GET home page. */
router.get('/', function(req, res, next) {
  translate('Tu es incroyable!', { to: 'en' }).then(data => {
    console.log(data.text); // OUTPUT: You are amazing!
  }).catch(err => {
    console.error(err);
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
