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
app.use(express.static('public'));

app.use(stormpath.init(app, {
  apiKeyId: '4I5B71C5G3FZOLO7RYJVMAWAT',
  apiKeySecret: 'KyTW5BNTFASZf792fGHUKyTG7vMJI16fhpFXK67sE8A',
  application: 'https://api.stormpath.com/v1/applications/4nNuaKjuY29IG8HhvcC0QG',
  secretKey: 'some_long_random_string',
  redirectUrl: '/dashboard'
}));

app.get('/dashboard', stormpath.loginRequired, function (req, res) {
  res.sendfile('views/index-member.html');
});

app.get(/^\/api\/(.*)/, stormpath.loginRequired, proxy);
app.post(/^\/api\/(.*)/, stormpath.loginRequired, proxy);
app.put(/^\/api\/(.*)/, stormpath.loginRequired, proxy);
app.delete(/^\/api\/(.*)/, stormpath.loginRequired, proxy);

function proxy (req, res) {
  console.log("--------------------------------------------")
  console.log(req.url.substring(4));
  var url = "http://cassyhub-api:80" + req.url.substring(4);
  console.log("Forwarding to " + url);

  var options = {
    url: url,
    method: req.method//,
    //headers: req.headers
  };
  console.log("options: ", options);

  if (req.files && !_.isEqual(req.files, {})) {
    options.formData = {};
    options.headers = {};
    var files = _.each(req.files, function(file, i) { options.formData["file" + i] = fs.createReadStream(file.path)});
  }

  if (req.body && !_.isEqual(req.body, {})) {
    console.log("Body: ", req.body);
    options.body = req.body;
    options.json = true;
    request(options, function(error, result, body) {
      if(error){
        console.log(error);
        res.send("error from router -> api");

      }else {
        res.send(result);
      }

    });

    /*
    var out = request(options);
    out.pipe(res);
    out.write(JSON.stringify(req.body));
    out.end();
    */
  } else {
    console.log("Empty Body")
    request(options).pipe(res);
  }
}

app.listen(PORT);
console.log('cassy-hub/router running on http://localhost:' + PORT);
