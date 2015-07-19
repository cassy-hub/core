var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var q = require('q');
var bodyParser = require('body-parser');
var _ = require('lodash');

// Constants
var PORT = 80;
var dbURL = 'mongodb://cassyhub-db:27017/cassy';

// App
var app = express();
app.use(bodyParser.json());

require('./insertDefaultContent')();

app.post('/:collectionName', function(req, res) {
    console.log("DAL request received for POST '/:collectionName': " + req.path);
    console.log("DAL request body: ", req.body);
    var database;
    getDB()
        .then(function(db) {
            database = db;
            var body = req.body;
            var collectionName = req.params.collectionName;
            switch (body.op) {
                case "find":
                    return findDocuments(db, collectionName, parseMatch(body.match));
                    break;
                case "insert":
                    return insertDocuments(db, collectionName, body.doc)
                    break;
                case "update":
                    return updateDocuments(db, collectionName, parseMatch(body.match), body.doc)
                    break;
                case "unset":
                    return unsetDocuments(db, collectionName, parseMatch(body.match))
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
        .catch(function(err) {
            console.log("DAL error: ", err);
            res.send(false);
        })
        .finally(function() {
            database.close();
        });
});

var findDocuments = function(db, collectionName, match) {
    var deferred = q.defer();
    console.log("");
    console.log(match);
    console.log("");
    db.collection(collectionName).find(match).toArray(function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

var insertDocuments = function(db, collectionName, doc) {
    var deferred = q.defer();
    db.collection(collectionName).insert(doc, function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise
};

var updateDocuments = function(db, collectionName, match, doc) {
    var deferred = q.defer();
    db.collection(collectionName).update(match, {
        $set: doc
    }, function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise
};

var unsetDocuments = function(db, collectionName, match) {
    var deferred = q.defer();
    db.collection(collectionName).remove(match, function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

var parseMatch = function(matchObject) {
    _.each(matchObject, function(val, key) {
        if (typeof val === 'object' && val.regex) {
            matchObject[key] = new RegExp(val.regex, 'g');
        }
    });
    return matchObject;
}

var getDB = function() {
    var deferred = q.defer();
    MongoClient.connect(dbURL, function(err, db) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(db);
        }
    });
    return deferred.promise;
};

app.listen(PORT);
console.log('cassy-hub/dal running on http://localhost:' + PORT);
