var express = require('express');
var proxy = require('express-http-proxy');

// Constants
var PORT = 80;

// App
var app = express();
app.use(express.static('www'));

app.get('/', function (req, res) {
  res.sendfile('www/index.html');
});

app.use('/api/', proxy('http://cassyhub-api/', {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
