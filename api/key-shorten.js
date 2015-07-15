// Copyright 2015 Andrei Karpushonak

"use strict";

var DOT_SEPARATOR = ".";
var _ = require('lodash');

function shorten(str) {
  return str.substring(0,5) + '...';
}

var shortenKeysFromObject = function (object, keys, options) {
  var keysToDelete;

  // deep copy by default
  var isDeep = true;

  // to preserve backwards compatibility, assume that only explicit options means shallow copy
  if (_.isUndefined(options) == false) {
    if (_.isBoolean(options.copy)) {
      isDeep = options.copy;
    }
  }

  // do not modify original object if copy is true (default)
  var finalObject;
  if (isDeep) {
    finalObject = _.clone(object, isDeep);
  } else {
    finalObject = object;
  }

  if (typeof finalObject === 'undefined') {
    throw new Error('undefined is not a valid object.');
  }
  if (arguments.length < 2) {
    throw new Error("provide at least two parameters: object and list of keys");
  }

  // collect keys
  if (Array.isArray(keys)) {
    keysToDelete = keys;
  } else {
    keysToDelete = [keys];
  }

  keysToDelete.forEach(function(elem) {
    for(var prop in finalObject) {
      if(finalObject.hasOwnProperty(prop)) {
        if (elem === prop) {
          // simple key to delete
          finalObject[prop] = shorten(finalObject[prop]);
        } else if (elem.indexOf(DOT_SEPARATOR) != -1) {
          var parts = elem.split(DOT_SEPARATOR);
          var pathWithoutLastEl;

          var lastAttribute;

          if (parts && parts.length === 2) {

            lastAttribute = parts[1];
            pathWithoutLastEl = parts[0];
            var nestedObjectRef = finalObject[pathWithoutLastEl];
            if (nestedObjectRef) {
              nestedObjectRef[lastAttribute] = shorten(nestedObjectRef[lastAttribute]);
            }
          } else if (parts && parts.length === 3) {
            // last attribute is the last part of the parts
            lastAttribute = parts[2];
            var deepestRef = (finalObject[parts[0]])[parts[1]];
            deepestRef[lastAttribute] = shorten(deepestRef[lastAttribute]);
          } else {
            throw new Error("Nested level " + parts.length + " is not supported yet");
          }

        } else {
          if (_.isObject(finalObject[prop]) && !_.isArray(finalObject[prop])) {

            finalObject[prop] = shortenKeysFromObject(finalObject[prop], keysToDelete, options);
          }
        }
      }

    }
  });

  return finalObject;

};

module.exports = shortenKeysFromObject;

