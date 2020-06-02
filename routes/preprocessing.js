var express = require('express');
var router = express.Router();
var fs = require("fs");
var d3 = require("d3");
var _ = require("lodash");

const Data = require('../models/Data');
const translate = require('@k3rn31p4nic/google-translate-api');

router.get('/', function (req, res, next) {

    fs.readFile("public/quoted.csv", "utf8", function (error, data) {
        data = d3.csvParse(data);
        var finale = [];
        var myData = new Data();
        for (let a = 0; a < data.length; a++) {

            translate(data[a].text, { to: 'en' }).then(tr => {
                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+tr.text);
                myData = new Data(
                    {
                        id: data[a].id,
                        TweetId: data[a].TweetId,
                        userName: data[a].UserName,
                        Date: data[a].date,
                        Retweet: data[a].retweets,
                        Text: data[a].text,
                        Geoloc: data[a].geoloc,
                        textTranslated: tr
                    },

                );
                
            }).catch(err => {
                console.error(err);
            });






            myData.save()
                    .then(item => {
                        console.log("data saved to database");
                    })
                    .catch(err => {
                        console.log(err)
                    });

            finale.push(myData);



        }
        res.send(JSON.stringify(finale));
    });
});



module.exports = router;