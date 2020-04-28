var express = require('express');
var router = express.Router();
const Data = require('../models/Data');
var TopicDetection = require('topic-detection');

function frequencyNumber(arr,ch){
    var count=0;
    for(let i=0;i<arr.length;i++){
if(arr[i]===ch) count++
    }
    return count;
}

  router.get('/worstTopics',function(req,res,next){
    var initial = [];
    var noOcc=[];
    var result=[];
Data.find({sentiment:{$lt: -0.5}},function(err,docs){
    docs.forEach(element => {
        var detector = new TopicDetection(); 
        var review=detector.topics(element.textTranslated)
        if(review!=null)
            initial.push(Object.keys(review)[0])
    
     
    });
    initial.forEach(element => {
        if(noOcc.indexOf(element)===-1) noOcc.push(element)
    });
    noOcc.forEach(element => {
        var el={'topic':element,occ:frequencyNumber(initial,element)}
        result.push(el)
    });
    
    res.send(result.sort(function(a, b) { 
        return - ( a.occ - b.occ   );
      }))
})


  })




  router.get('/bestTopics',function(req,res,next){
    var initial = [];
    var noOcc=[];
    var result=[];
Data.find({sentiment:{$gt: 0.5}},function(err,docs){
    docs.forEach(element => {
        var detector = new TopicDetection(); 
        var review=detector.topics(element.textTranslated)
        if(review!=null)
            initial.push(Object.keys(review)[0])
    
     
    });
    initial.forEach(element => {
        if(noOcc.indexOf(element)===-1) noOcc.push(element)
    });
    noOcc.forEach(element => {
        //console.log(element +" "+frequencyNumber(initial,element))
        var el={'topic':element,occ:frequencyNumber(initial,element)}
        result.push(el)
    });
    
    res.send(result.sort(function(a, b) { 
        return - ( a.occ - b.occ   );
      }))
})


  })

  router.get('/naturalTopics',function(req,res,next){
    var initial = [];
    var noOcc=[];
    var result=[];
Data.find({sentiment:{$eq: 0}},function(err,docs){
    docs.forEach(element => {
        var detector = new TopicDetection(); 
        var review=detector.topics(element.textTranslated)
        if(review!=null)
            initial.push(Object.keys(review)[0])
    
     
    });
    initial.forEach(element => {
        if(noOcc.indexOf(element)===-1) noOcc.push(element)
    });
    noOcc.forEach(element => {
        //console.log(element +" "+frequencyNumber(initial,element))
        var el={'topic':element,occ:frequencyNumber(initial,element)}
        result.push(el)
    });
    
    res.send(result.sort(function(a, b) { 
        return - ( a.occ - b.occ   );
      }))
})


  })




  router.get('/bestReviewsByTopic', async function(req, res) {

    var reviews=[];
    let topic = req.query.topic;
    Data.find({sentiment:{$gt: 0.5}},function(err,docs){
        docs.forEach(element => {
            var detector = new TopicDetection(); 
            var review=detector.topics(element.textTranslated)
            if(review!=null)
                if(Object.keys(review)[0]===topic)

                reviews.push(element) 
         
        });
        res.send(reviews);
    })
    
});
router.get('/worstReviewsByTopic', async function(req, res) {

    var reviews=[];
    let topic = req.query.topic;
    Data.find({sentiment:{$lt: -0.5}},function(err,docs){
        docs.forEach(element => {
            var detector = new TopicDetection(); 
            var review=detector.topics(element.textTranslated)
            if(review!=null)
                if(Object.keys(review)[0]===topic)
                reviews.push(element) 
            
        });
        res.send(reviews);
    })
    
});
module.exports = router;