var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var q = require('q');
var bodyParser = require('body-parser');

// Constants
var PORT = 80;
var dbURL = 'mongodb://cassyhub-db:27017/cassy';

// App
var app = express();
app.use(bodyParser.json());


app.post('/:collectionName', function (req, res) {
	console.log("DAL request received for POST '/:collectionName': "+req.path);
	console.log("DAL request body: ",req.body);
	var database;
	getDB()
		.then(function(db){
			database = db;
			var body = req.body;
			var collectionName = req.params.collectionName;
			switch(body.op)
			{
				case "find":
					return findDocuments(db, collectionName, body.match);
				break;
				case "upsert":
					return upsertDocuments(db, collectionName, body.match, body.doc)
				break;
				case "unset":
					return unsetDocuments(db, collectionName, body.match, body.path)
				break;
				default:
					console.log("unknown DAL op: ", body.op);
					res.send(false);
				break;
			}
		})
		.then(function(result) {
			console.log("DAL result:", result);
			res.send(result);
		})
		.catch(function(err){
			console.log("DAL error: ", err);
			res.send(false);
		})
		.finally(function(){
			database.close();
		});
});

var findDocuments = function(db, collectionName, match) {
	var deferred = q.defer();
	db.collection(collectionName).find(match).toArray(function(err, result){
		if(err){
			deferred.reject(err);
		}else{
			deferred.resolve(result);
		}
	});
	return deferred.promise;
};

var upsertDocuments = function(db, collectionName, match, doc) {
  var deferred = q.defer();
	db.collection(collectionName).update(match, {$set: doc}, {upsert: true}, function(err, result){
		if(err){
			deferred.reject(err);
		}else{
			deferred.resolve(result);
		}
	});
	return deferred.promise
};

var unsetDocuments = function(db, collectionName, match, path) {
  var deferred = q.defer();
	var doc = {};
  doc[path] = "";
  db.collection(collectionName).update(match, {$unset: doc},function(err, result){
		if(err){
			deferred.reject(err);
		}else{
			deferred.resolve(result);
		}
	});
	return deferred.promise;
};

var getDB = function() {
	var deferred = q.defer();
	MongoClient.connect(dbURL, function(err, db) {
		if(err){
			deferred.reject(err);
		}else{
			deferred.resolve(db);
		}
	});
	return deferred.promise;
};

app.listen(PORT);
console.log('cassy-hub/dal running on http://localhost:' + PORT);
