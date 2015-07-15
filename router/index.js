var express = require('express');
//var proxy = require('express-http-proxy');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');
var request = require('request');
var _ = require('lodash');
var fs = require('fs');

// Constants
var PORT = 80;

// App
var app = express();
app.use(bodyParser.json());
app.use('/vendor', express.static('node_modules'));
app.use('/vendor', express.static('bower_components'));
app.use(express.static('public'));

app.use(stormpath.init(app, {
  apiKeyId: '4I5B71C5G3FZOLO7RYJVMAWAT',
  apiKeySecret: 'KyTW5BNTFASZf792fGHUKyTG7vMJI16fhpFXK67sE8A',
  application: 'https://api.stormpath.com/v1/applications/4nNuaKjuY29IG8HhvcC0QG',
  secretKey: 'some_long_random_string',
  enableForgotPassword: true
}));

app.get('/get-user', function (req, res) {
  res.send(req.user ? {
    'username': req.user.username,
    'givenName': req.user.givenName,
    'middleName': req.user.middleName,
    'surname': req.user.surname,
    'fullName': req.user.fullName,
  }: 'false');
});

app.all(/^\/api\/(.*)/, stormpath.loginRequired, function(req, res) {
  var url = 'http://cassyhub-api:80' + req.url.substring(4);
  console.log('Router proxy forwarding to ' + url);

  var options = {
    url: url,
    method: req.method
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
    if(error) {
      console.log('Router proxy error: ', error);
      res.send('error from router -> api');
    } else {
      res.send(result.body);
    }
  });
});

app.get('/*', function (req, res) {
  res.sendfile('public/index.html');
});

app.listen(PORT);
console.log('cassy-hub/router running on http://localhost:' + PORT);
