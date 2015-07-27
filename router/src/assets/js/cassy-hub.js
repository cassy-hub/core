var CassyHub = (function () {
   var ch = {};
   var config = {};
   var locale;

   ch.setup = function(options) {
     config.publickey = options.publickey;
     config.language = options.language || false;
     config.defaultLanguage = options.defaultLanguage || "en";
     config.supportedLanguages = options.supportedLanguages || ["en", "es"];
     config.protocol = options.protocol || "http";
     config.host = options.host || "cassyhub.io";
     config.port = options.port || "80";
   }

   ch.setLanguage = function(lang) {
      locale = lang;
   }

   ch.init = function () {
         $( ".cassy-hub" ).each(function() {
              if (locale === undefined) {
                 locale = (navigator.language || navigator.browserLanguage).split('-')[0];
                 if (config.supportedLanguages.indexOf(locale) === -1) {
                    locale = config.defaultLanguage;
                 }
              };

              var self = this;
              var reqUrl = config.protocol + "://" + config.host + ":" + config.port + "/api-public/public-docs/" + this.dataset.tag;
              if (config.language) {
                 reqUrl = reqUrl + "/" + locale + "/"
              }
              $.ajax({
                  url: reqUrl,
                  headers: {"publickey": config.publickey},
                  success: function(data) { $( self ).text(data) }
              });
        });
     }
   return ch;
}());

