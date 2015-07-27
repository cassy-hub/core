var express = require('express');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');
var request = require('request');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cassyhub = require('./cassy-hub');

var config = require('./stormpath.json');

// Constants
var PORT = 80;

var folder_for_static_content = 'src';

// App
var app = express();
app.use(bodyParser.json());
app.use('/vendor', express.static('node_modules'));
app.use('/vendor', express.static('bower_components'));
app.use(express.static(folder_for_static_content, {
    index: 'disabled'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(stormpath.init(app, {
    apiKeyId: config.apiKey,
    apiKeySecret: config.apiSecret,
    application: config.application,
    secretKey: 'some_long_random_string',
    enableForgotPassword: true,
    redirectUrl: '/dashboard'
}));

cassyhub.setup({
    'id': '4DUBQGZ2OZR6DGUM9FFEO37UI',
    'secret': 'OgxX8BTXsxV4cxePezRN+p57pjB5OZW8HMUW9vfBIfU',
    'language': true
});
app.use(cassyhub.init);

app.get('/dev_init.js', function(req, res) {
    var requirejsdata = require('./src/requirejs.json');
    res.send('require.config(' + JSON.stringify(requirejsdata) + '); requirejs([\'jsx!app\']);');
});

app.get('/get-user', function(req, res) {
    res.send(req.user ? req.user : 'false');
});

app.get('/get-api-keys', stormpath.loginRequired, function(req, res) {
    var publicKey = req.user.href.split('/').pop();
    res.locals.user.getApiKeys(function(err, collectionResult) {
        res.send({
            privateKeys: collectionResult,
            publicKey: publicKey
        });
    });
});

app.get('/', function(req, res) {
    res.render("index");
});

app.get('/es', function(req, res) {
    req.setLocale("es");
    res.render("index");
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

app.all(/^\/api\/(.*)/, stormpath.loginRequired, privateProxy);
app.all(/^\/api-private\/public-docs\/(.*)/, stormpath.apiAuthenticationRequired, privateProxy);
app.all(/^\/api-private\/public-tree\/(.*)/, stormpath.apiAuthenticationRequired, privateProxy);
app.all(/^\/api-private\/(.*)/, stormpath.apiAuthenticationRequired, privateProxy);
app.all(/^\/api-public\/public-docs\/(.*)/, publicProxy);
app.all(/^\/api-public\/public-tree\/(.*)/, publicProxy);


function privateProxy(req, res) {
    var url = 'http://cassyhub-api:80' + req.url.substring(req.url.indexOf('/', 1));
    console.log('Router proxy forwarding to ' + url);

    var userID = req.user.href.split('/').pop();
    proxy(req, res, userID, url);
}

function publicProxy(req, res) {
    var url = 'http://cassyhub-api:80' + req.url.substring(req.url.indexOf('/', 1));
    console.log('Router proxy forwarding to ' + url);

    var userID = req.headers.publickey || "no_user";
    proxy(req, res, userID, url);
}

function proxy(req, res, userID, url) {
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

app.get('/dashboard', dashboard);
app.get('*', dashboard);

function dashboard(req, res) {
    fs.readFile(folder_for_static_content + '/index.html', 'utf8', function(err, html) {
        if (err) {
            throw err;
        }
        html = _.template(html)({
            IN_PRODUCTION: folder_for_static_content === 'src' ? false : true
        });
        res.writeHeader(200, {
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();
    });
}

app.listen(PORT);
console.log('cassy-hub/router running on http://localhost:' + PORT);
