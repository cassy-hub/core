var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

app.get('/', function (req, res) {
  
// Connection URL
  var url = 'mongodb://localhost:27017/cassy';
// Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocuments(db, function() {
      findDocuments(db, function(result){
        res.send('Hello world scooby234 connected' + result.length);
        db.close();
      })
    });
  });

});

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
