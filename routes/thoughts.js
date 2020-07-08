var express = require('express');
var router = express.Router();
const Data = require('../models/Data');
const Plan = require('../models/Plan');
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
router.get('/chartSolutions', async function(req, res) {
var tabSol=[]
var probDesc=""
   
    await Plan.find({},function(err,docs){
       console.log()
        if(docs[0]!=undefined){
        
            probDesc=docs[req.query.indiceProb].Description
            docs[req.query.indiceProb].Solutions.forEach(element => {
    if(element.status==='done'){
        tabSol.push(element)
   
    }
});
        }
      
    })
    setTimeout(() => {
        var reviews=[]
       
        if(tabSol.length==1){
            var detector = new TopicDetection();
            var scores = detector.topics(probDesc);
            Data.find({ $and: [ { sentiment: { $lt: 0 } }, { textTranslated: {$regex :  Object.keys(scores)[0]} } ] },function(err,docs){
                var nbBefore=0;
                var nbAfter=0;
                var final=[];
                docs.forEach(element => {
                    if(new Date(element.Date)< new Date(tabSol[0].date))
                    nbBefore++;
                    else nbAfter++
                });
                var obj={
                    previous:nbBefore,
                    solution:nbAfter,
                   // date :new Date(tabSol[0].date)
                }
                final.push(obj)
                //parcours/////////
                res.send(final)
            })
           
        }
        else if(tabSol.length>1){
            var detector = new TopicDetection();
            var scores = detector.topics(probDesc);
            Data.find({ $and: [ { sentiment: { $lt: 0 } }, { textTranslated: {$regex :  Object.keys(scores)[0]} } ] },function(err,docs){
                var nbBefore=0;
                var nbAfter=0;
                var final=[];
                docs.forEach(element => {
                    
                    if(new Date(element.Date)< new Date(tabSol[0].date))
                    nbBefore++;
                   // else nbAfter++
                });
               /* var obj={
                    previous:nbBefore,
                    solution:nbAfter,
                }*/
                final.push(nbBefore)
              //  final.push(nbAfter)
                //parcours/////////
                
                for(let i=1;i<tabSol.length;i++){
                    var nbb=0;
                    var nba=0;
                    console.log(tabSol[i-1].date)
                    console.log(tabSol[i].date)
                    docs.forEach(element => {
                        
                        //(new Date(element.Date)< new Date(tabSol[i].date))&&(new Date(element.Date)>new Date(tabSol[i-1].date))
                        if((new Date(element.Date)>new Date(tabSol[i-1].date))&&(new Date(element.Date)<new Date(tabSol[i].date)))
                        nbb++;
                        else if(new Date(element.Date)>new Date(tabSol[i].date))
                        nba++
                    });
                   /* var obj={
                        previous:nbb,
                        solution:nba,
                    }*/
                    final.push(nbb)
                    final.push(nba)
                }
                res.send(final)
            })
            
        }
        else if(tabSol.length==0){
            var final=[];
            res.send(final)
        } 
        
    }, 2000);
    
       // res.send("cc");
    
    
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


router.post('/addProblem', async function(req, res) {

 var plan=new Plan(req.body);

console.log(plan)

plan.save()
.then(item => {
  console.log("data " + i + " saved to database");
})
.catch(err => {
  console.log(err)
});
    res.send("haha")
});

router.get('/allProblems', async function(req, res) {

   
    Plan.find({},function(err,docs){
        res.send(docs)
    })

  
   });
   router.post('/updateSolution', async function(req, res) {

   
    
   Plan.find({_id:req.body._id},function(err,doc){
  doc.forEach(element => {
    element.Solutions=req.body.Solutions;
    element.save();
  });
  })
  
res.send("j")
  
   });

   router.post('/updateSolutionStatus', async function(req, res) {

    console.log("dddd")
    var obj=new Plan(req.body)
    Plan.find({_id:req.body._id},function(err,doc){
        doc.forEach(element => {
            element.Solutions[req.query.indice].status='done'
           // element.Solutions[req.query.indice].date=new Date()
          element.save()
        });
    
    
  res.send("j")
   });
   });


   
   router.post('/removeProb', async function(req, res) {

   
    
    Plan.find({_id:req.body._id},function(err,doc){
        doc.forEach(element => {
      
          element.remove({})
        });
   
    })
 res.send("j")
   
    });


   

module.exports = router;