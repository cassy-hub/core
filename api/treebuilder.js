var _ = require('lodash');
module.exports = {

  /*
  dataObjects = data to convert to tree, array of objects
  pathKey = the field in each object which holds the object path i.e, cassy-hub tags, e.g., 'tags' holding: rootnode/firstchild/secondchild
  pathSeparator = the separator in the pathKey which splits each level e.g. / in rootnode/firstchild/secondchild
  splitPathKeyName = the field which will be added to each child which holds the split path name, e.g. rootnode/firstchild/secondchild = 'rootnode', 'firstchild' e.t.c
  returns the newly created tree array
  */
  buildTree: function(dataObjects, pathKey, pathSeparator, splitPathKeyName) {
    var tree = [];
    _.each(dataObjects, function(obj) {
      var pathArray = _.trimRight(obj[pathKey], pathSeparator).split(pathSeparator);
      var child = tree;
      _.each(pathArray, function(pathSection, i) {
        var newChild = _.find(child, splitPathKeyName, pathSection);
        if (undefined === newChild) {
          newChild = {
            'children': []
          };
          newChild[splitPathKeyName] = pathSection;
          child.push(newChild);
        }
        if (pathArray.length - 1 == i) {
          _.extend(newChild, obj);
        }
        child = newChild.children;
      });
    });
    return tree;
  }

};
