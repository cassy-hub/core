var assert = require("assert");
var nock = require("nock");
var http = require("http");
var cassyhub = require("../cassy-hub");

var response = [
{ "children":
    [ { "children":
        [ { "children":
            [ { "children": [],
                    "tag": "money", "_id": "55b37728e961511700aaf857", "title": "showmethemoney",
                    "tags": "show/me/the/money/", "content":
                    "mooooney", "published": true, "userid": "6V2Z8bf5ej1Ma4O89tJRhc" },
             { "children": [],
                     "tag": "football", "_id": "55b37728e961511700aaf857", "title": "showmethemoney",
                     "tags": "show/me/the/football/", "content":
                     "foootballll", "published": true, "userid": "6V2Z8bf5ej1Ma4O89tJRhc" }],
            "tag": "the" } ],
        "tag": "me" } ],
    "tag": "show" },
{ "children": [],
    "tag": "jeremy", "_id": "55b37728e961511700aaf857", "title": "jeremy",
    "tags": "jeremy/", "content":
    "kyle", "published": true, "userid": "6V2Z8bf5ej1Ma4O89tJRhc" }
]
var api = nock("http://cassy-hub-test:5555")
            .get("/api-private/public-tree/")
            .reply(200, response);

var mockReq = {
    headers: {}
};

var mockRes = {
    locals: {}
};

var cassyhubConfig = {
   initialContentRetrieval: 1,
   host: "cassy-hub-test",
   port: 5555
};

before(function(done) {
  cassyhub.setup(cassyhubConfig);
  setTimeout(function () {
    cassyhub.init(mockReq, mockRes, function() {
        done();
    })
  }, 1500);
});

describe('Cassy Hub', function() {
  describe('Get stuff from tree', function () {
    it('should return content from the tree for given tag', function () {
        var content = mockRes.locals.___('show/me/the/money');
        assert.equal(content, "mooooney");
    });

    it('should return content from the tree for given tag at the same level', function () {
        var content = mockRes.locals.___('show/me/the/football');
        assert.equal(content, "foootballll");
    });

    it('should return content from the root level of the tree', function () {
        var content = mockRes.locals.___('jeremy');
        assert.equal(content, "kyle");
    });

    it('should return no content if tag doesnt exit', function (done) {
          var content = mockRes.locals.___('show/me/the');
          assert.equal(content, "Content not found");
          setTimeout(function () {
            assert.equal(api.isDone(), true);
            done();
          }, 10);
    });
  });
});