var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var _ = require('lodash');
var q = require('q');

// Constants
var PORT = 80;

// App
var app = express();
app.use(bodyParser.json());

function dalClient(payload) {
    var deferred = q.defer();
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(err, result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

var errorFunc = function(err) {
    console.log(err);
    res.send('error from api -> dal');
}

app.get('/_test', function(req, res) {
    res.send('Hi! The time is: ' + new Date().toString());
});

//todo: remove comment

app.get(/^\/tree\/(.*)/, function(req, res) {
    console.log('API GET /tree');
    var query = '^' + _.trimRight(req.params[0], '/') + '\\/';
    var payload = {
        op: 'find',
        match: {
            'userid': req.headers.userid
        }
    };
    if (req.params[0]) {
       payload.match.tags = { 'regex': query };
    }
    console.log(payload);
    dalClient(payload)
        .then(function(result) {
             if(result.body) {
               res.send(require('./treebuilder').buildTree(result.body, 'tags', '/', 'tag'));
             } else {
               res.send('Document not found');
             }
         })
         .catch(errorFunc)
});


/***
 ** GET DOCUMENT (by tags)
 **/
app.get(/^\/documents\/(.*)/, function(req, res) {
    console.log('API GET /documents');
    var payload = {
        op: 'find',
        match: {
            'userid': req.headers.userid,
            'tags': req.params[0]
        }
    };

    dalClient(payload)
        .then(function(result) {
             console.log('API GET result: ', result);
             result = result.body;
             if (!result[0]) {
                 result = 'Document not found';
             } else {
                 result = result[0].content;
             }
             res.send(result);
         })
         .catch(errorFunc)
});

app.get("/stats", function(req, res) {
    console.log('API GET /documents');
    var payload = {
        op: 'find',
        match: {
        }
    };

    dalClient(payload)
        .then(function(result) {
             result = result.body;
             var payload2 = {
                     op: 'distinct',
                     match: {
                     },
                     field: "userid"
             };

             dalClient(payload2)
                 .then(function(result) {
                      result2 = result2.body;
                      res.send({totalDocs: result.length, usersWithContent: result2.length});
                  });
         })
         .catch(errorFunc)
});

app.get(/^\/public-docs\/(.*)/, function(req, res) {
    console.log('API GET /documents');
    var payload = {
        op: 'find',
        match: {
            'userid': req.headers.userid,
            'tags': req.params[0],
            'published': true
        }
    };

    dalClient(payload)
        .then(function(result) {
             console.log('API GET result: ', result);
             result = result.body;
             if (!result[0]) {
                 result = 'Document not found';
             } else {
                 result = result[0].content;
             }
             res.send(result);
         })
         .catch(errorFunc)
});

app.get(/^\/public-tree\/(.*)/, function(req, res) {
    console.log('API GET /tree');
    var query = '^' + _.trimRight(req.params[0], '/') + '\\/';
    var payload = {
        op: 'find',
        match: {
            'userid': req.headers.userid,
            'published': true
        }
    };
    if (req.params[0]) {
       payload.match.tags = { 'regex': query };
    }
    console.log(payload);
    dalClient(payload)
        .then(function(result) {
             if(result.body) {
               res.send(require('./treebuilder').buildTree(result.body, 'tags', '/', 'tag'));
             } else {
               res.send('Document not found');
             }
         })
         .catch(errorFunc)
});

app.post('/documents', function(req, res) {
    console.log('API POST /documents');
    if (!_.endsWith(req.body.tags, '/')) {
        req.body.tags += '/';
    }
    if (_.startsWith(req.body.tags, '/')) {
        req.body.tags = req.body.tags.substring(1);
    }
    var payload = {
        op: 'find',
        match: {
            'userid': req.headers.userid,
            'tags': req.body.tags
        }
    };

    dalClient(payload)
        .then(function(result) {
             console.log('API GET result: ', result.body);
             result = result.body;
             if (!result[0]) {
                 console.log('POSTING DOC');
                 var payload2 = {
                     op: 'insert',
                     doc: req.body
                 };
                 payload2.doc.userid = req.headers.userid;
                 dalClient(payload2)
                     .then(function(result2) {
                          res.send(result2.body);
                     })
             } else {
                 res.send('Document with tag already exists');
             }
         })
         .catch(errorFunc)
});

/***
 ** UPDATE DOCUMENT
 **/
app.put('/documents', function(req, res) {
    console.log('API PUT /documents');
    if (!_.endsWith(req.body.tags, '/')) {
        req.body.tags += '/';
    }
    var payload = {
        op: 'update',
        match: {
            'userid': req.headers.userid,
            'tags': req.body.tags
        },
        doc: req.body
    };
    payload.doc.userid = req.headers.userid;

    dalClient(payload)
        .then(function(result) {
             res.send(result.body);
         })
         .catch(errorFunc)
});



/***
 ** DELETE DOCUMENT
 **/
app.delete('/documents', function(req, res) {
    console.log('API DELETE /documents');
    var query = '^' + _.trimRight(req.body.tags, '/') + '\\/';
    var payload = {
        op: 'unset',
        match: {
            'userid': req.headers.userid,
            'tags': {
                'regex': query
            }
        }
    };
    dalClient(payload)
        .then(function(result) {
             res.send(result.body);
         })
         .catch(errorFunc)
});


app.listen(PORT);
console.log('cassy-hub/api running on http://localhost:' + PORT);
