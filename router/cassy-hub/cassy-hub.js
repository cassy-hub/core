var request = require("request");
var _ = require("lodash");
var locale = require("locale");

var config = {
    host: "localhost",
    protocol: "http",
    port: 80,
    resetContentInterval: 10,
    startTag: "",
    language: false,
    supportedLanguages: ["en", "es"]
};

var contentTree;
var supported;
var gotTree = false;
var auth;
var cassyhub;

function setup(options) {
   _.extend(config, options);
   auth = "Basic " + new Buffer(config.id + ":" + config.secret).toString("base64");
   cassyhub = config.protocol + "://" + config.host + ":" + config.port;
   var url = cassyhub + "/api-public/public-tree/" + config.startTag;
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
             gotTree = true;
           }
       );
   }, config.resetContentInterval * 1000);
   if (config.language) {
     supported = new locale.Locales(config.supportedLanguages);
   }
}

function init(req, res, next) {
  var locales = new locale.Locales(req.headers["accept-language"]);

  var overLocale;

  req.setLocale = function (inLocale) {
     overLocale = inLocale;
  }

  res.locals.___ = function (requested_tag) {
     if (config.language) {
        var lang = overLocale || locales.best(supported);
        requested_tag = requested_tag + "/" + lang;
     }
     var tags = requested_tag.split("/");
     var child = contentTree;
     _.each(tags, function(tag, i) {
        child = _.find(child, {'tag': tag});
        if (child && i !== tags.length - 1) {
            child = child.children;
        }
     });
     var content;
     if (child && (child.content !== undefined)) {
        content = child.content
     } else {
        content = "Content not found";
        if (gotTree) {
          request(
             {
               method: "POST",
               url : cassyhub + "/api-public/documents",
               headers : {
                 "Authorization" : auth
               },
               json: {
                "tags": requested_tag,
                "content": "",
                "published": true
               }
             },
             function (error, response, body) {
             }
          );
        }
     }
     return content;
  }
  next();
};

module.exports = {
  setup: setup,
  init: init
}