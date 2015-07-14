var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var request = require('request');

// Constants
var PORT = 1041;

// App
var app = express();
app.use(express.static('www'));

app.get('/api/', function (req, res) {

  request('http://localhost:1040/data/', function(error, response, body) {
    res.send(body);
  });

});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
