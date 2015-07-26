var CassyHub = (function () {
   var ch = {};
   var config = {};
   ch.setup = function(options) {
     config.publickey = options.publickey;
     config.language = options.language || false;
   }
   ch.init = function () {
         $( ".cassy-hub" ).each(function() {
              var language = (navigator.language || navigator.browserLanguage).split('-')[0];
              var self = this;
              var reqUrl = "/api-public/public-docs/" + $( this ).text();
              if (config.language) {
                 reqUrl = reqUrl + "/" + language + "/"
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

