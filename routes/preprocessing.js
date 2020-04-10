var express = require('express');
var router = express.Router();
var fs = require("fs");
var d3 = require("d3");
var _ = require("lodash");



router.get('/', function(req, res, next) {
    
    fs.readFile("public/quoted.csv", "utf8", function(error, data) {
        data = d3.csvParse(data);
        res.send(JSON.stringify(data));
      });
  });
  
  module.exports = router;