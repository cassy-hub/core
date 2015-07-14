var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var stormpath = require('express-stormpath');



// Constants
var PORT = 8080;

// App
var app = express();
app.use(express.static('www'));
app.use(bodyParser.json());

app.use(stormpath.init(app, {
  apiKeyId: '4I5B71C5G3FZOLO7RYJVMAWAT',
  apiKeySecret: 'KyTW5BNTFASZf792fGHUKyTG7vMJI16fhpFXK67sE8A',
  application: 'https://api.stormpath.com/v1/applications/4nNuaKjuY29IG8HhvcC0QG',
  secretKey: 'some_long_random_string'
}));

app.get('/i', stormpath.loginRequired, function (req, res) {
  res.sendfile('www/index.html');
});

app.get(/^\/api\/(.*)/, stormpath.loginRequired, function (req, res) {

// Connection URL
  var url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/cassy';
// Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    var params = req.params[0].split('/').join(".");
      findDocuments(db, {userId: "123"}, function(result){
        var content;
        if (!_.get(result[0], params)) {
          content = "Tag not found"
        } else if (_.get(result[0], params).content) {
          content = _.get(result[0], params).content
        } else {
          content = _.get(result[0], params)
        }
        res.send(content);
        db.close();
      });
  });

});

app.post('/api', stormpath.loginRequired, function (req, res) {

// Connection URL
  var url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/cassy';
// Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var tag = req.body.tags.split("/").join(".");
    var update = {};
    update[tag + ".content"] = req.body.content;

    upsertDocuments(db, {userId: "123"}, update, function() {
        res.send("Inserted");
        db.close();
    });
  });

});

app.delete('/api', stormpath.loginRequired, function (req, res) {

// Connection URL
  var url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/cassy';
// Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var tag = req.body.tags.split("/").join(".");

    upsetDocuments(db, {userId: "123"}, tag, function() {
      res.send("Deleted");
      db.close();
    });
  });

});

var findDocuments = function(db, match, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find(match).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
};

var upsertDocuments = function(db, match, doc, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.update(match,
      {$set: doc}, {upsert: true}, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
};

var upsetDocuments = function(db, match, path, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  var doc = {};
  doc[path] = "";
  // Insert some documents
  collection.update(match,
      {$unset: doc}, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
};

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
