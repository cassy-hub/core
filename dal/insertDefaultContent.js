var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var q = require('q');
var _ = require('lodash');

var dbURL = 'mongodb://cassyhub-db:27017/cassy';

var defaultDocs = [
   {
        "_id": "55ab95e73d1127170083ddaf",
        "title": "english",
        "tags": "home/title/en/",
        "content": "\nWelcome to <strong>Cassy Hub</strong>\n",
        "published": true,
        "userid": "6V2Z8bf5ej1Ma4O89tJRhc"
   },
   {
       "_id": "55ab95e73d1127170083ddad",
       "title": "english",
       "tags": "home/description/en/",
       "content": "\nCreate an account to access the goodness\n",
       "published": true,
       "userid": "6V2Z8bf5ej1Ma4O89tJRhc"
   },
   {
       "_id": "55ab95e73d1127170083ddac",
       "title": "english",
       "tags": "home/title/es/",
       "content": "\nBienvenido a <strong>Cassy Hub</strong>\n",
       "published": true,
       "userid": "6V2Z8bf5ej1Ma4O89tJRhc"
    },
    {
      "_id": "55ab95e73d1127170083ddab",
      "title": "english",
      "tags": "home/description/es/",
      "content": "\nCrear una cuenta para tener acceso a la bondad\n",
      "published": true,
      "userid": "6V2Z8bf5ej1Ma4O89tJRhc"
    }
]

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

var updateDocuments = function(db, collectionName, match, doc) {
    var deferred = q.defer();
    db.collection(collectionName).update(match, {
        $set: doc
    }, {upsert: true}, function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise
};


module.exports = function () {
    getDB().then(function(db) {
      _.each(defaultDocs, function(doc) {
        updateDocuments(db, "documents", {_id: doc._id}, doc);
      })
    });
}