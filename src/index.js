var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
app.get('/', function (req, res) {
  var MongoClient = require('mongodb').MongoClient
      , assert = require('assert');

// Connection URL
  var url = 'mongodb://localhost:27017/cassy';
// Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    res.send('Hello world scooby234 connected\n');

    db.close();
  });

});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
