var request = require("request");

var request = require('request'),
    username = "",
    password = "",
    url = "http://localhost/api-public/public/";

function config(apiKey) {
  username = apiKey.id;
  password = apiKey.secret;
}

function init(req, res, next) {
  res.locals.___ = function (tag) {
    console.log(username)
    console.log(password)
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    request(
        {
          url : url + tag,
          headers : {
            "Authorization" : auth
          }
        },
        function (error, response, body) {
          callback(JSON.parse(response.body)[0].content);
        }
    );
  }
  next();
};

module.exports = {
  config: config,
  init: init
}