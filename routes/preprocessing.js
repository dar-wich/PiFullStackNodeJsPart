var express = require('express');
var router = express.Router();
var fs = require("fs");
var d3 = require("d3");
var _ = require("lodash");

const Data = require('../models/Data');

router.get('/', function(req, res, next) {
    
    fs.readFile("public/quoted.csv", "utf8", function(error, data) {
        data = d3.csvParse(data);
        
        for(let a=0;a<data.length;a++){
            
            var myData = new Data(
         {id:data[a].id,
         TweetId:data[a].TweetId,
         userName:data[a].UserName,
         Date:data[a].date,
         Retweet:data[a].retweets,
         Text:data[a].text,
         Geoloc:data[a].geoloc,
         textTranslated:'default'},

         );
         
     myData.save()
       .then(item => {
        console.log("data saved to database");
       })
       .catch(err => {
        console.log(err)
       }); 
       
   }
        res.send(JSON.stringify(data));
      });
  });
  
  
  
  module.exports = router;