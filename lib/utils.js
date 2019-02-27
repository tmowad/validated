"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeOf = typeOf;
exports.isObject = isObject;
exports.flatten = flatten;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @copyright 2016-present, Andrey Popp <8mayday@gmail.com>
 * 
 */
function typeOf(value) {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  } else {
    return _typeof(value);
  }
}

function isObject(obj) {
  return obj != null && _typeof(obj) === 'object' && !Array.isArray(obj);
}

function flatten(array) {
  var result = [];

  for (var i = 0; i < array.length; i++) {
    result = result.concat(array[i]);
  }

  return result;
}
