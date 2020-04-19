var express = require('express');
var router = express.Router();
const csvtojson = require("csvtojson");
const Data = require('../models/Data');
var translate = require('yandex-translate')('trnsl.1.1.20200416T235008Z.cada43d169913740.d1fd1faa2446f114076daa5b06fdbfac6cd71ff3');
const SW = require('stopword');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
async function Do() {
  var i = 0;
  tab: [];
  csvtojson().fromFile("public/quoted.csv")
    .then(csvData => { tab = csvData; console.log(tab.length) })
  setTimeout(() => {
    tab.forEach((element, j) => {
      setTimeout(() => {
        const text = translate.translate(element.text, { to: 'en' }, function (err, res) {
          if (res != undefined) {
            i++;
            console.log(res.text + " " + i)
            var myData = new Data(
              {
                id: element.id,
                TweetId: element.TweetId,
                userName: element.UserName,
                Date: element.date,
                Retweet: element.retweets,
                Text: element.text,
                Geoloc: element.geoloc,
                textTranslated: res.text + ""
              },
            );
            myData.save()
              .then(item => {
                console.log("data " + i + " saved to database");
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
router.get('/', function (req, res, next) {
  Do()

  res.send('Translation + Import to DB ');


});

async function prePro() {
  let result = [];
  Data.find({}, function (err, datas) {
    datas.forEach(x => {
      if((x.textTranslated!="undefined")&&(x.textTranslated!="")){
      const lexedReview = aposToLexForm(x.textTranslated);

      const casedReview = lexedReview.toLowerCase();

      let alphaOnlyReview = casedReview.replace('""', '');
      alphaOnlyReview = alphaOnlyReview.replace('RT ', '');
      alphaOnlyReview = alphaOnlyReview.replace(/@[A-Za-z0-9]+/gm, '');
      alphaOnlyReview = alphaOnlyReview.replace(/^(\s*#\w+\s*)+$/gm, "")
      alphaOnlyReview = alphaOnlyReview.replace(/(?:https?|ftp):\/\/[\n\S]+/gm, '');
      alphaOnlyReview = alphaOnlyReview.replace(/[^a-zA-Z\s]+/gm, '');

      const { WordTokenizer } = natural;
      const tokenizer = new WordTokenizer();
      const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

      const filteredReview = SW.removeStopwords(tokenizedReview);
      console.log(JSON.stringify(filteredReview))
      result.push(filteredReview);
      }
    });
    return result;
  }); 
}

router.get('/analysis', function (req, res, next) {
  let result = prePro();
  console.log(JSON.stringify(result));
  res.send(JSON.stringify(result));

});

router.get('/removeAll', function (req, res, next) {
  Data.find({}, function (err, datas) {
    datas.forEach(x=>{
      Data.remove({},{},function(){});
    });
    res.send(JSON.stringify(datas));
  });
  
});


module.exports = router;
