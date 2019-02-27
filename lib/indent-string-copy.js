// Explicitly copied from
// https://github.com/sindresorhus/indent-string/tree/458eca3f626b95bdcff5afe30d1568bf76889920
// to avoid the ES6-only dependency as a tentative measure to keep IE11 and Safari9
// compatibility.  (edited to satisfy validated prettier rules)
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (str, count, opts) {
  // Support older versions: use the third parameter as options.indent
  // TODO: Remove the workaround in the next major version
  var options = _typeof(opts) === 'object' ? Object.assign({
    indent: ' '
  }, opts) : {
    indent: opts || ' '
  };
  count = count === undefined ? 1 : count;

  if (typeof str !== 'string') {
    throw new TypeError("Expected `input` to be a `string`, got `".concat(_typeof(str), "`"));
  }

  if (typeof count !== 'number') {
    throw new TypeError("Expected `count` to be a `number`, got `".concat(_typeof(count), "`"));
  }

  if (typeof options.indent !== 'string') {
    throw new TypeError("Expected `options.indent` to be a `string`, got `".concat(_typeof(options.indent), "`"));
  }

  if (count === 0) {
    return str;
  }

  var regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
  return str.replace(regex, options.indent.repeat(count));
};
