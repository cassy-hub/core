var request = require("request");
var _ = require("lodash");

var config = {
    host: "localhost",
    protocol: "http",
    port: 80,
    resetContentInterval: 10,
    startTag: ""
};

var contentTree;

function setup(options) {
   _.extend(config, options);
   var auth = "Basic " + new Buffer(config.id + ":" + config.secret).toString("base64");
   var url = config.protocol + "://" + config.host + ":" + config.port + "/api-public/public-tree/" + config.startTag;
   setInterval(function(){
       request(
           {
             url : url,
             headers : {
               "Authorization" : auth
             }
           },
           function (error, response, body) {
             contentTree = JSON.parse(response.body);
           }
       );
   }, config.resetContentInterval * 1000);
}

function init(req, res, next) {
  res.locals.___ = function (requested_tag) {
     var tags = requested_tag.split("/");
     var child = contentTree;
     _.each(tags, function(tag, i) {
        child = _.find(child, {'tag': tag});
        if (child && i !== tags.length - 1) {
            child = child.children;
        }
     });
     return (child && child.content) || "Content not found";
  }
  next();
};

module.exports = {
  setup: setup,
  init: init
}