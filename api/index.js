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
            'userid': req.headers.userid,
            'tags': {
                'regex': query
            }
        }
    };
    console.log(payload);
    request.post({
        uri: 'http://cassyhub-dal:80/documents',
        json: payload
    }, function(error, result) {
        if (error) {
            console.log(error);
            res.send('error from api -> dal');
            return;
        }
        //console.log('API tree GET result: ', result);
        result = result.body;
        if (!result) {
            result = 'Document not found';
        } else {
            var tree = [];


            //each document
            _.each(result, function(dataObj) {

                var tagsArr = dataObj.tags.split('/');
                tagsArr.splice(-1, 1);
                //each tag layer
                var child = tree;
                var newChild;
                _.each(tagsArr, function(tagSection, i) {

                    newChild = _.find(child, 'tag', tagSection);
                    if (newChild === undefined) {
                        if (i === tagsArr.length - 1) {
                            newChild = dataObj;
                        } else {
                            newChild = {};
                        }
                        newChild.tag = tagSection;
                        newChild.children = newChild.children || [];
                        child.push(newChild);
                    } else {
                        if (i === tagsArr.length - 1) {
                            _.extend(newChild, dataObj);
                        }
                    }
                    child = newChild.children;

                });

            });

            result = tree;

        }
        res.send(result);
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
        if (!result) {
            result = 'Document not found';
        }
        res.send(result);
    });
});


/***
 ** INSERT DOCUMENT
 **/
app.get(/^\/public\/(.*)/, function(req, res) {
    console.log('API GET /public');
    var payload = {
        op: 'find',
        match: {
            'userid': req.headers.userid
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
        var params = req.params[0].split('/').join('.');
        var content;
        result = result.body;
        if (!_.get(result[0], params)) {
            content = 'Tag not found';
        } else if (_.get(result[0], params).document && _.get(result[0], params).document.published === true) {
            content = _.get(result[0], params).document.content;
        } else {
            content = 'No content found for tag';
        }
        res.send(content);
    });
});

app.post('/documents', function(req, res) {
    console.log('API POST /documents');
    if (!_.endsWith(req.body.tags, '/')) {
        req.body.tags += '/';
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
    var payload = {
        op: 'unset',
        match: {
            'userid': req.headers.userid,
            'tags': req.body.tags
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
