var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
app.use(express.static('www'));

app.get('/', function (req, res) {
  res.sendfile('www/index.html');
});

app.get('/api/', function (req, res) {

// Connection URL
  var url = 'mongodb://localhost:27017/cassy';
// Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocuments(db, function() {
      findDocuments(db, function(result){
        res.send({ times: result.length });
        db.close();
      });
    });
  });

});

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
};

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}
  ], function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
};

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
