var express = require('express');
var proxy = require('express-http-proxy');

// Constants
var PORT = 80;

// App
var app = express();
app.use(express.static('www'));
app.use('/vendor', express.static('node_modules'));

app.get('/', function (req, res) {
	res.sendfile('www/index.html');
});

app.use('/api', proxy('cassyhub-api', {
	forwardPath: function(req, res) {
		return require('url').parse(req.url).path;
	}
}));

app.listen(PORT);
console.log('cassy-hub/router running on http://localhost:' + PORT);
