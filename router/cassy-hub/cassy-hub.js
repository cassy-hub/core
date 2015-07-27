var request = require("request");
var _ = require("lodash");
var locale = require("locale");

var config = {
    host: "cassyhub.io",
    protocol: "http",
    port: 80,
    initialContentRetrieval: 10,
    resetContentInterval: 1,
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
   var reqUrl = cassyhub + "/api-private/public-tree/" + config.startTag;
   var getTree = function (){
       request(
           {
             url : reqUrl,
             headers : {
               "Authorization" : auth
             }
           },
           function (error, response, body) {
             contentTree = JSON.parse(response.body);
             gotTree = true;
           }
       );
   }
   setTimeout(getTree, config.initialContentRetrieval * 1000);
   setInterval(getTree, config.resetContentInterval * 60000);
   if (config.language) {
     supported = new locale.Locales(config.supportedLanguages);
   }

}

function createContent(cassyhub, auth, requested_tag) {
    request(
     {
           method: "POST",
           url : cassyhub + "/api-private/documents",
           headers : {
             "Authorization" : auth
           },
           json: {
            "tags": requested_tag,
            "content": "",
            "published": true
           }
         },
         function (error, response, body) {}
    );
}

function getChild(requested_tag, contentTree) {
    var tags = requested_tag.split("/");
     var child = contentTree;
     _.each(tags, function(tag, i) {
        child = _.find(child, {'tag': tag});
        if (child && i !== tags.length - 1) {
            child = child.children;
        }
     });
     return child;
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
     var child = getChild(requested_tag, contentTree)
     var content;
     if (child && (child.content !== undefined)) {
        content = child.content
     } else {
        content = "Content not found";
        if (gotTree) {
          createContent(cassyhub, auth, requested_tag);
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