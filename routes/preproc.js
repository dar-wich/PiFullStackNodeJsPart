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
          if ((res != undefined) && (res.text != undefined)) {

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

function sentiment(sentence) {
  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(sentence);
  console.log(JSON.stringify(analysis));
  return analysis;
}

/*const analysis = (sentence)=>{
  return analyzer.getSentiment(sentence)
}*/

router.get('/testAnalysis', (req, res, next) => {
  let arrayExample = ["I", "and", "love", "cherries"]
  let sen = sentiment(arrayExample);

  res.send(JSON.stringify(sentiment(arrayExample)));
})

function prePro() {
  let result = [];
  Data.find({}, function (err, datas) {
    datas.forEach(x => {
      if ((x.textTranslated != "undefined") && (x.textTranslated != "")) {
        const lexedReview = aposToLexForm(x.textTranslated);

        const casedReview = lexedReview.toLowerCase();

        let alphaOnlyReview = casedReview.replace('""', '');
        alphaOnlyReview = alphaOnlyReview.replace('RT ', '');
        alphaOnlyReview = alphaOnlyReview.replace(/@[A-Za-z0-9]+/gm, '');
        alphaOnlyReview = alphaOnlyReview.replace(/^(\s*#\w+\s*)+$/gm, "");
        alphaOnlyReview = alphaOnlyReview.replace(/(?:https?|ftp):\/\/[\n\S]+/gm, '');
        alphaOnlyReview = alphaOnlyReview.replace(/[^a-zA-Z\s]+/gm, '');

        const { WordTokenizer } = natural;
        const tokenizer = new WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

        const filteredReview = SW.removeStopwords(tokenizedReview);
        let sen = sentiment(filteredReview);




        console.log(sen);
        x.sentiment = Number(sen);
        x.save();
        result.push(sen);
      }
    });
  });
  return result;
}

router.get('/analysis', async function (req, res, next) {
  let result = await prePro();
  setTimeout(() => {
    res.send(JSON.stringify(result));
  }, 1000);


});

function performance() {
  let result = [];
  for (let i = 0; i < new Date().getMonth() + 1; i++) {
    let object = { month: i+1, nbBadRev: 0, nbGoodRev: 0, nbNaturalRev: 0 };
    Data.aggregate([
      { $match: { $and: [{ $expr: { $eq: [{ $month: "$Date" }, i + 1] } }, { sentiment: { $lt: 0 } }] } },
      { $count: "nbBadRev" }
    ]).exec(function (err, res) {
      if (res[0] != undefined){
        object.nbBadRev = JSON.stringify(res[0].nbBadRev);
      }
    });
    Data.aggregate([
      { $match: { $and: [{ $expr: { $eq: [{ $month: "$Date" }, i + 1] } }, { sentiment: { $gt: 0 } }] } },
      { $count: "nbGoodRev" }
    ]).exec(function (err, res) {
      if (res[0] != undefined)
        object.nbGoodRev = JSON.stringify(res[0].nbGoodRev);
    });
    Data.aggregate([
      { $match: { $and: [{ $expr: { $eq: [{ $month: "$Date" }, i + 1] } }, { sentiment: { $eq: 0 } }] } },
      { $count: "nbNatRev" }
    ]).exec(function (err, res) {
      if (res[0] != undefined)
        object.nbNaturalRev = JSON.stringify(res[0].nbNatRev);
    });
    result.push(object)
    
  }
  setTimeout(()=>{console.log(JSON.stringify(result));
  },2000)
  return result;
}

router.get('/performance', async function (req, res, next) {
  let stat = await performance();
  setTimeout(() => {
    res.send(JSON.stringify(stat));
  }, 1000);
});

router.get('/removeAll', async function (req, res, next) {
  Data.find({}, function (err, datas) {
    datas.forEach(x => {
      if (x.textTranslated == "undefined") {
        x.remove();
      }

    });
    res.send(JSON.stringify(datas));
  });


});

router.get('/getAllTweets', async function (req, res, next) {
  Data.find({ sentiment: { $ne: null }},function (err,datas) {
    res.send(datas)
  })

 
});

module.exports = router;
