var express = require('express');
var router = express.Router();
const csvtojson = require("csvtojson");
const Data = require('../models/Data');
var translate = require('yandex-translate')('trnsl.1.1.20200416T235008Z.cada43d169913740.d1fd1faa2446f114076daa5b06fdbfac6cd71ff3');




async function Do(){
    
    var i=0;
 
    tab:[];
   
    csvtojson().fromFile("public/quoted.csv")
  .then(csvData => {tab=csvData;console.log(tab.length)})
    
    setTimeout(() => {
        
        tab.forEach((element, j) => {
            setTimeout(() => {
                const text =  translate.translate(element.text, { to: 'en' }, function(err, res) {
                    
            if(res!=undefined){
                i++;
                console.log(res.text+" "+i)
                var myData = new Data(
                    {id:element.id,
                    TweetId:element.TweetId,
                    userName:element.UserName,
                    Date:element.date,
                    Retweet:element.retweets,
                    Text:element.text,
                    Geoloc:element.geoloc,
                    textTranslated:res.text+""
                  },
            
                    );
                    myData.save()
              .then(item => {
               console.log("data "+i+" saved to database");
              })
              .catch(err => {
               console.log("error")
              });
                
            }
            
                 
             })
            }, j * 500);
          });
    }, 2000);
    

    
    
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  Do()

    res.send('Translation + Import to DB ');

	  
  });
 

module.exports = router;
