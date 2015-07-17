var express = require('express');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');
var request = require('request');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// Constants
var PORT = 80;

var folder_for_static_content = 'src';

// App
var app = express();
app.use(bodyParser.json());
app.use('/vendor', express.static('node_modules'));
app.use('/vendor', express.static('bower_components'));
app.use(express.static(folder_for_static_content));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(stormpath.init(app, {
    apiKeyId: '4I5B71C5G3FZOLO7RYJVMAWAT',
    apiKeySecret: 'KyTW5BNTFASZf792fGHUKyTG7vMJI16fhpFXK67sE8A',
    application: 'https://api.stormpath.com/v1/applications/4nNuaKjuY29IG8HhvcC0QG',
    secretKey: 'some_long_random_string',
    enableForgotPassword: true
}));

app.get('/dev_init.js', function(req, res) {
    var requirejsdata = require('./src/requirejs.json');
    res.send('require.config(' + JSON.stringify(requirejsdata) + '); requirejs([\'jsx!app\']);');
});

app.get('/get-user', function(req, res) {
    res.send(req.user ? req.user : 'false');
});

app.get('/get-api-keys', stormpath.loginRequired, function(req, res) {
    res.locals.user.getApiKeys(function(err, collectionResult) {
        res.send(collectionResult);
    });
});

app.get('/create-api-key', stormpath.loginRequired, function(req, res) {
    req.user.createApiKey(function(err, apiKey) {
        if (err) {
            res.json(503, {
                error: 'Something went wrong. Please try again.'
            });
        } else {
            res.json({
                id: apiKey.id,
                secret: apiKey.secret
            });
        }
    });
});

app.delete('/delete-api-key/:apiId', stormpath.loginRequired, function(req, res) {
    res.locals.user.getApiKeys(function(err, apiKeys) {
        if (err) {
            res.json(503, {
                error: 'Something went wrong. Please try again.'
            });
        } else {
            apiKeys.each(function(apiKey) {
                if (apiKey.id === req.params.apiId) {
                    apiKey.delete(function() {
                        res.json({
                            status: 'success'
                        });
                    });
                }
            });
        }
    });
});

app.all(/^\/api\/(.*)/, stormpath.loginRequired, proxy);
app.all(/^\/api-public\/public\/(.*)/, stormpath.apiAuthenticationRequired, proxy);

function proxy(req, res) {
    var url = 'http://cassyhub-api:80' + req.url.substring(req.url.indexOf('/', 1));
    console.log('Router proxy forwarding to ' + url);

    var userID = req.user.href.split('/').pop();
    var options = {
        url: url,
        method: req.method,
        headers: {
            'userid': userID
        }
    };

    if (req.files && !_.isEqual(req.files, {})) {
        options.formData = {};
        options.headers = {};
        _.each(req.files, function(file, i) {
            options.formData['file' + i] = fs.createReadStream(file.path);
        });
    }

    if (req.body && !_.isEqual(req.body, {})) {
        options.body = req.body;
        options.json = true;
    }
    request(options, function(error, result) {
        if (error) {
            console.log('Router proxy error: ', error);
            res.send('error from router -> api');
        } else {
            res.send(result.body);
        }
    });
}

app.get('/*', function(req, res) {
    res.render('../' + folder_for_static_content + '/index.ejs', {
      IN_DEVELOPMENT: folder_for_static_content === 'src' ? true : false
    });
});

app.listen(PORT);
console.log('cassy-hub/router running on http://localhost:' + PORT);
