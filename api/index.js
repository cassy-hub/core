var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var _ = require('lodash');

// Constants
var PORT = 80;

// App
var app = express();
app.use(bodyParser.json());

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
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, dalResult) {
        if(error) {
          console.log(error);
          res.send('error from api -> dal');
        } else if(dalResult.body) {
          res.send(require('./treebuilder').buildTree(dalResult.body, 'tags', '/', 'tag'));
        } else {
          res.send('Document not found');
        }
    });
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

    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        console.log('API GET result: ', result);
        result = result.body;
        if (!result[0]) {
            result = 'Document not found';
        } else {
            result = result[0].content;
        }
        res.send(result);
    });
});

app.get("/stats", function(req, res) {
    console.log('API GET /documents');
    var payload = {
        op: 'find',
        match: {
        }
    };

    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        result = result.body;
        var payload2 = {
                op: 'distinct',
                match: {
                },
                field: "userid"
        };

        request.post({
            uri: 'http://cassyhub-dal:80/documents',
            json: payload2
        }, function(err, result2) {
            if (error) {
                console.log(error);
                res.send('error from api -> dal');
                return;
            }
            console.log('API GET result: ', result2.body);
            result2 = result2.body;
            res.send({totalDocs: result.length, usersWithContent: result2.length});
        });
    });
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

    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        console.log('API GET result: ', result);
        result = result.body;
        if (!result[0]) {
            result = 'Document not found';
        } else {
            result = result[0].content;
        }
        res.send(result);
    });
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
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, dalResult) {
        if(error) {
          console.log(error);
          res.send('error from api -> dal');
        } else if(dalResult.body) {
          res.send(require('./treebuilder').buildTree(dalResult.body, 'tags', '/', 'tag'));
        } else {
          res.send('Document not found');
        }
    });
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
        op: 'insert',
        doc: req.body
    };
    payload.doc.userid = req.headers.userid;
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        res.send(result.body);
    });
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
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        res.send(result.body);
    });
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
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        res.send(result.body);
    });
});


app.listen(PORT);
console.log('cassy-hub/api running on http://localhost:' + PORT);
