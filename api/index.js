var express = require('express');
var request = require('request');
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser');
var _ = require('lodash');
var deleteKey = require('key-del');

// Constants
var PORT = 80;

// App
var app = express();
app.use(bodyParser.json());

app.get('/_test', function (req, res) {
  res.send('Hi! The time is: ' + new Date().toString());
});

app.get('/documents', function (req, res) {
  console.log('API GET /documents');
  var payload = {
    op: 'find',
    match: {
      'userid': req.headers.userid
    }
  }
  request.post({uri: 'http://cassyhub-dal:80/documents', json: payload}, function(error, result, body) {
    if(error){
      console.log(error);
      res.send("error from api -> dal");
      return;
    }
    console.log("API GET result: ", result);
    result = result.body;
    result = deleteKey(_.chain(result[0]).omit('userid').omit('_id').value(), "content");
    res.send(result);
  });
});

app.get(/^\/documents\/(.*)/, function (req, res) {
  console.log('API GET /documents');
  var payload = {
    op: 'find',
    match: {
      'userid': req.headers.userid
    }
  }
  request.post({uri: 'http://cassyhub-dal:80/documents', json: payload}, function(error, result, body) {
    if(error){
      console.log(error);
      res.send("error from api -> dal");
      return;
    }
    console.log("API GET result: ", result);
    var params = req.params[0].split('/').join(".");
    var content;
    result = result.body;
    if (!_.get(result[0], params)) {
      content = "Tag not found"
    } else if (_.get(result[0], params).content) {
      content = _.get(result[0], params).content
    } else {
      content = _.get(result[0], params)
    }
    res.send(content);
	});
});

app.post('/documents', function (req, res) {
  console.log('API POST /documents');
  var tag = req.body.tags.split("/").join(".");
  var update = {};
  update[tag + ".content"] = req.body.content;
  var payload = {
    op: 'upsert',
     match: {
       'userid': req.headers.userid
     },
     doc: update
   };
  request.post({uri: 'http://cassyhub-dal:80/documents', json: payload}, function(error, result, body) {
    if(error){
      console.log(error);
      res.send("error from api -> dal");
      return;
    }
		res.send(result.body);
	});
});


app.delete('/documents', function (req, res) {
  console.log('API DELETE /documents');
  var tag = req.body.tags.split("/").join(".");
  var payload = {
    op: 'unset',
     match: {
       'userid': req.headers.userid
     },
     path: tag
   };
  request.post({uri: 'http://cassyhub-dal:80/documents', json: payload}, function(error, result, body) {
    if(error){
      console.log(error);
      res.send("error from api -> dal");
      return;
    }
		res.send(result.body);
	});
});


app.listen(PORT);
console.log('cassy-hub/api running on http://localhost:' + PORT);
