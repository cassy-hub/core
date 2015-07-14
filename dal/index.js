var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var bluebird = require('bluebird');
bluebird.promisifyAll(mongodb);
var bodyParser = require('body-parser');

// Constants
var PORT = 80;
var dbURL = 'mongodb://cassyhub-db:27017/cassy';

// App
var app = express();
app.use(bodyParser.json());

//List all?
app.get('/:collectionName', function (req, res) {	
	getDB()
		.then(function(db){
			return db.collection(req.params.collectionName).find().toArray();
		})
		.then(function(docs) {
			res.send(docs);
		})
		.catch(function(err){
			res.send(false);
		});
});
//Read by ID
app.get('/:collectionName/:id', function (req, res) {
	getDB()
		.then(function(db){
			return db.collection(req.params.collectionName).find(req.params.id).toArray();
		})
		.then(function(docs) {
			res.send(docs);
		})
		.catch(function(err){
			res.send(false);
		});
});
//Create
app.post('/:collectionName', function (req, res) {
	getDB()
		.then(function(db){
			return db.collection(req.params.collectionName).insert(res.body)
		})
		.then(function(result) {
			res.send(result);
		})
		.catch(function(err){
			res.send(false);
		});
});
//Update
app.patch('/:collectionName/:id', function (req, res) {

});
//Delete
app.delete('/:collectionName/:id', function (req, res) {
	
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var getDB = function() {
	var deferred = bluebird.defer();
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
