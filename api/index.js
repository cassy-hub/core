var express = require('express');
var request = require('request');
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser');

// Constants
var PORT = 80;

// App
var app = express();
app.use(bodyParser.json());

app.get('/_test', function (req, res) {
  res.send('Hi! The time is: ' + new Date().toString());
});

app.get('/documents', function (req, res) {
	request.get('http://cassyhub-dal:80/documents', function(error, response, body) {
		if(error){
			res.send(error);
		}else{
			res.send(response.body);
		}
	});
});
app.post('/documents', function (req, res) {
	request.post('http://cassyhub-dal:80/documents', req.body, function(error, response, body) {
		if(error){
			res.send(error);
		}else{
			res.send(response.body);
		}
	});
});

app.listen(PORT);
console.log('cassy-hub/api running on http://localhost:' + PORT);