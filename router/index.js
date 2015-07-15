var express = require('express');
var proxy = require('express-http-proxy');
var stormpath = require('express-stormpath');

// Constants
var PORT = 80;

// App
var app = express();
app.use('/vendor', express.static('node_modules'));
app.use(express.static('public'));

app.use(stormpath.init(app, {
  apiKeyId: '4I5B71C5G3FZOLO7RYJVMAWAT',
  apiKeySecret: 'KyTW5BNTFASZf792fGHUKyTG7vMJI16fhpFXK67sE8A',
  application: 'https://api.stormpath.com/v1/applications/4nNuaKjuY29IG8HhvcC0QG',
  secretKey: 'some_long_random_string',
  enableForgotPassword: true
}));

app.get('/get-user', function (req, res) {
  res.send(req.user ? req.user : "false");
});


app.get('/*', function (req, res) {
  res.sendfile('public/index.html');
});

app.use('/api', stormpath.loginRequired, proxy('cassyhub-api', {
	forwardPath: function(req, res) {
		return require('url').parse(req.url).path;
	}
}));

app.listen(PORT);
console.log('cassy-hub/router running on http://localhost:' + PORT);
