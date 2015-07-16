function init(req, res, next) {
    res.locals.___ = function (tag) {
      return "TESTING " + tag;
    }
    next();
};

module.exports = {
  init: init
}