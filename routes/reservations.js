var express = require('express');
var router = express.Router();

"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '6474e879de8f48cc94417ab7b6252983';
const endpoint = 'https://pikurate.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

async function entityRecognition(entityInputs, client){
  const entityResults = await client.recognizeEntities(entityInputs, "ko");
  return entityResults[0].entities;
};

/* GET courses listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/date', async function(req, res, next) {
  var text = req.body.text;
  const entityInputs = [
    text
  ];
  var entities = await entityRecognition(entityInputs, textAnalyticsClient);

  var date = "2021";
  entities.forEach(entity => {
    if (entity.category=="Quantity") {
      switch(entity.subCategory){
        case "Number":
          if (entity.text.length == 1) {
            date += "0";
          }
          date += entity.text;
        case "Ordinal":
          date += entity.text.substring(0,entity.text.length-1);
      }
    }
  }); 
  
  var result = {"date": date}
  res.send(result);
  res.end();
});

router.post('/time', async function(req, res, next) {
  var text = req.body.text;
  const entityInputs = [
    text
  ];
  var entities = await entityRecognition(entityInputs, textAnalyticsClient);

  var hour = 0;
  var time = "";
  if (text.indexOf("오후") != -1){
    hour += 12;
  } 
  entities.forEach(entity => {
    if (entity.category=="Quantity" & entity.subCategory=="Number") {
      var hourNum = entity.text *1;
      hour += hourNum;
      var hourStr = hour + "";
      if (hourStr == 1){
        time += "0";
        time += hourStr;
      }else{
        time += hourStr;
      }
    }
  });
  time += ":00"; 
  
  var result = {"time": time};
  res.send(result);
  res.end();
});

router.post('/companion', async function(req, res, next) {
  var text = req.body.text;
  const entityInputs = [
    text
  ];
  var entities = await entityRecognition(entityInputs, textAnalyticsClient);

  var companion = 1;
  entities.forEach(entity => {
    if (entity.category=="Quantity" & entity.subCategory=="Number") {
      companion += entity.text*1 -1;
    }
  });
  
  var result = {"companion": companion};
  res.send(result);
  res.end();
});

router.post('/confirm', async function(req, res, next) {
  var text = req.body.text;
  console.log(text);
});

module.exports = router;