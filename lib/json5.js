"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _schema = require("./schema");

var _utils = require("./utils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var parse = function () {
  'use strict';

  function location(state) {
    return "line ".concat(state.lineNumber, " column ").concat(state.columnNumber - 1);
  }

  var Context =
  /*#__PURE__*/
  function (_ContextBase) {
    _inherits(Context, _ContextBase);

    function Context(state) {
      var _this;

      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      _classCallCheck(this, Context);

      if (message) {
        message = "".concat(message, " (").concat(location(state), ")");
      }

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Context).call(this, message, parent));
      _this.state = state;
      return _this;
    }

    _createClass(Context, [{
      key: "buildMapping",
      value: function buildMapping(validateValue) {
        var _this2 = this;

        var state = white(this.state);

        if (state.ch !== '{') {
          var _value = value(state),
              val = _value.value;

          throw this.error("Expected a mapping but got ".concat((0, _utils.typeOf)(val)));
        } else {
          var _object = object(state, function (key, valueState, keyState) {
            valueState = white(valueState);
            var valueContext = new Context(valueState, "While validating value at key \"".concat(key, "\""), _this2);
            var keyContext = new Context(keyState, "While validating key \"".concat(key, "\""), _this2);

            var _validateValue = validateValue(valueContext, key, keyContext),
                context = _validateValue.context,
                value = _validateValue.value;

            return {
              state: context.state,
              value: value
            };
          }),
              _val = _object.value,
              nextState = _object.state;

          return {
            value: _val,
            context: new Context(nextState)
          };
        }
      }
    }, {
      key: "buildSequence",
      value: function buildSequence(validateValue) {
        var _this3 = this;

        var state = white(this.state);

        if (state.ch !== '[') {
          var _value2 = value(state),
              val = _value2.value;

          throw this.error("Expected an array but got ".concat((0, _utils.typeOf)(val)));
        } else {
          var _array = array(state, function (idx, valueState) {
            valueState = white(valueState);
            var valueContext = new Context(valueState, "While validating value at index ".concat(idx), _this3);

            var _validateValue2 = validateValue(valueContext),
                context = _validateValue2.context,
                value = _validateValue2.value;

            return {
              state: context.state,
              value: value
            };
          }),
              _val2 = _array.value,
              nextState = _array.state;

          return {
            value: _val2,
            context: new Context(nextState)
          };
        }
      }
    }, {
      key: "buildMessage",
      value: function buildMessage(originalMessage, contextMessages) {
        if (contextMessages.length === 0) {
          return "".concat(originalMessage, " (").concat(location(this.state), ")");
        } else {
          return originalMessage;
        }
      }
    }, {
      key: "unwrap",
      value: function unwrap(validate) {
        var _value3 = value(white(this.state)),
            state = _value3.state,
            val = _value3.value;

        val = validate(val);
        return {
          value: val,
          context: new Context(state)
        };
      }
    }]);

    return Context;
  }(_schema.Context); // This is a function that can parse a JSON5 text, producing a JavaScript
  // data structure. It is a simple, recursive descent parser. It does not use
  // eval or regular expressions, so it can be used as a model for implementing
  // a JSON5 parser in other languages.
  // We are defining the function inside of another function to avoid creating
  // global variables.


  var escapee = {
    "'": "'",
    '"': '"',
    '\\': '\\',
    '/': '/',
    '\n': '',
    // Replace escaped newlines in strings w/ empty string
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
  },
      ws = [' ', '\t', '\r', '\n', '\v', '\f', '\xA0', "\uFEFF"],
      renderChar = function renderChar(chr) {
    return chr === '' ? 'EOF' : "'" + chr + "'";
  },
      error = function error(m, state) {
    // Call error when something is wrong.
    var error = new SyntaxError(); // beginning of message suffix to agree with that provided by Gecko - see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

    error.message = m + ' at line ' + state.lineNumber + ' column ' + state.columnNumber + ' of the JSON5 data. Still to read: ' + JSON.stringify(state.text.substring(state.at - 1, state.at + 19));
    error.at = state.at; // These two property names have been chosen to agree with the ones in Gecko, the only popular
    // environment which seems to supply this info on JSON.parse

    error.lineNumber = state.lineNumber;
    error.columnNumber = state.columnNumber;
    throw error;
  },
      next = function next(c, state) {
    var nextState = Object.assign({}, state); // If a c parameter is provided, verify that it matches the current character.

    if (c && c !== state.ch) {
      error('Expected ' + renderChar(c) + ' instead of ' + renderChar(state.ch), state);
    } // Get the next character. When there are no more characters,
    // return the empty string.


    nextState.ch = state.text.charAt(state.at);
    nextState.at = state.at + 1;
    nextState.columnNumber = state.columnNumber + 1;

    if (nextState.ch === '\n' || nextState.ch === '\r' && peek(nextState) !== '\n') {
      nextState.lineNumber = state.lineNumber + 1;
      nextState.columnNumber = 0;
    }

    return nextState;
  },
      peek = function peek(state) {
    // Get the next character without consuming it or
    // assigning it to the ch varaible.
    return state.text.charAt(state.at);
  },
      identifier = function identifier(state) {
    // Parse an identifier. Normally, reserved words are disallowed here, but we
    // only use this for unquoted object keys, where reserved words are allowed,
    // so we don't check for those here. References:
    // - http://es5.github.com/#x7.6
    // - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
    // - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
    // TODO Identifiers can have Unicode "letters" in them; add support for those.
    var key = state.ch; // Identifiers must start with a letter, _ or $.

    if (state.ch !== '_' && state.ch !== '$' && (state.ch < 'a' || state.ch > 'z') && (state.ch < 'A' || state.ch > 'Z')) {
      error('Bad identifier as unquoted key', state);
    } // Subsequent characters can contain digits.


    while ((state = next(undefined, state)) && state.ch && (state.ch === '_' || state.ch === '$' || state.ch >= 'a' && state.ch <= 'z' || state.ch >= 'A' && state.ch <= 'Z' || state.ch >= '0' && state.ch <= '9')) {
      key += state.ch;
    }

    return {
      state: state,
      value: key
    };
  },
      number = function number(state) {
    // Parse a number value.
    var number,
        sign = '',
        string = '',
        base = 10;

    if (state.ch === '-' || state.ch === '+') {
      sign = state.ch;
      state = next(state.ch, state);
    } // support for Infinity (could tweak to allow other words):


    if (state.ch === 'I') {
      var valueAndState = word(state);
      number = valueAndState.value;
      state = valueAndState.state;

      if (typeof number !== 'number' || isNaN(number)) {
        error('Unexpected word for number', state);
      }

      return {
        state: state,
        value: sign === '-' ? -number : number
      };
    } // support for NaN


    if (state.ch === 'N') {
      var valueAndState = word(state);
      number = valueAndState.value;
      state = valueAndState.state;

      if (!isNaN(number)) {
        error('expected word to be NaN', state);
      } // ignore sign as -NaN also is NaN


      return {
        state: state,
        value: number
      };
    }

    if (state.ch === '0') {
      string += state.ch;
      state = next(undefined, state);

      if (state.ch === 'x' || state.ch === 'X') {
        string += state.ch;
        state = next(undefined, state);
        base = 16;
      } else if (state.ch >= '0' && state.ch <= '9') {
        error('Octal literal', state);
      }
    }

    switch (base) {
      case 10:
        while (state.ch >= '0' && state.ch <= '9') {
          string += state.ch;
          state = next(undefined, state);
        }

        if (state.ch === '.') {
          string += '.';

          while ((state = next(undefined, state)) && state.ch && state.ch >= '0' && state.ch <= '9') {
            string += state.ch;
          }
        }

        if (state.ch === 'e' || state.ch === 'E') {
          string += state.ch;
          state = next(undefined, state);

          if (state.ch === '-' || state.ch === '+') {
            string += state.ch;
            state = next(undefined, state);
          }

          while (state.ch >= '0' && state.ch <= '9') {
            string += state.ch;
            state = next(undefined, state);
          }
        }

        break;

      case 16:
        while (state.ch >= '0' && state.ch <= '9' || state.ch >= 'A' && state.ch <= 'F' || state.ch >= 'a' && state.ch <= 'f') {
          string += state.ch;
          state = next(undefined, state);
        }

        break;
    }

    if (sign === '-') {
      number = -string;
    } else {
      number = +string;
    }

    if (!isFinite(number)) {
      error('Bad number', state);
    } else {
      return {
        state: state,
        value: number
      };
    }
  },
      string = function string(state) {
    // Parse a string value.
    var hex,
        i,
        string = '',
        delim,
        // double quote or single quote
    uffff; // When parsing for string values, we must look for ' or " and \ characters.

    if (state.ch === '"' || state.ch === "'") {
      delim = state.ch;

      while (state = next(undefined, state)) {
        if (state.ch === delim) {
          state = next(undefined, state);
          return {
            state: state,
            value: string
          };
        } else if (state.ch === '\\') {
          state = next(undefined, state);

          if (state.ch === 'u') {
            uffff = 0;

            for (i = 0; i < 4; i += 1) {
              state = next(undefined, state);
              hex = parseInt(state.ch, 16);

              if (!isFinite(hex)) {
                break;
              }

              uffff = uffff * 16 + hex;
            }

            string += String.fromCharCode(uffff);
          } else if (state.ch === '\r') {
            if (peek(state) === '\n') {
              state = next(undefined, state);
            }
          } else if (typeof escapee[state.ch] === 'string') {
            string += escapee[state.ch];
          } else {
            break;
          }
        } else if (state.ch === '\n') {
          // unescaped newlines are invalid; see:
          // https://github.com/aseemk/json5/issues/24
          // TODO this feels special-cased; are there other
          // invalid unescaped chars?
          break;
        } else {
          string += state.ch;
        }
      }
    }

    error('Bad string', state);
  },
      inlineComment = function inlineComment(state) {
    // Skip an inline comment, assuming this is one. The current character should
    // be the second / character in the // pair that begins this inline comment.
    // To finish the inline comment, we look for a newline or the end of the text.
    if (state.ch !== '/') {
      error('Not an inline comment', state);
    }

    do {
      state = next(undefined, state);

      if (state.ch === '\n' || state.ch === '\r') {
        state = next(undefined, state);
        return state;
      }
    } while (state.ch);

    return state;
  },
      blockComment = function blockComment(state) {
    // Skip a block comment, assuming this is one. The current character should be
    // the * character in the /* pair that begins this block comment.
    // To finish the block comment, we look for an ending */ pair of characters,
    // but we also watch for the end of text before the comment is terminated.
    if (state.ch !== '*') {
      error('Not a block comment', state);
    }

    do {
      state = next(undefined, state);

      while (state.ch === '*') {
        state = next('*', state);

        if (state.ch === '/') {
          state = next('/', state);
          return state;
        }
      }
    } while (state.ch);

    error('Unterminated block comment');
  },
      comment = function comment(state) {
    // Skip a comment, whether inline or block-level, assuming this is one.
    // Comments always begin with a / character.
    if (state.ch !== '/') {
      error('Not a comment');
    }

    state = next('/', state);

    if (state.ch === '/') {
      state = inlineComment(state);
    } else if (state.ch === '*') {
      state = blockComment(state);
    } else {
      error('Unrecognized comment');
    }

    return state;
  },
      white = function white(state) {
    // Skip whitespace and comments.
    // Note that we're detecting comments by only a single / character.
    // This works since regular expressions are not valid JSON(5), but this will
    // break if there are other valid values that begin with a / character!
    while (state.ch) {
      if (state.ch === '/') {
        state = comment(state);
      } else if (ws.indexOf(state.ch) >= 0) {
        state = next(undefined, state);
      } else {
        return state;
      }
    }

    return state;
  },
      word = function word(state) {
    // true, false, or null.
    switch (state.ch) {
      case 't':
        state = next('t', state);
        state = next('r', state);
        state = next('u', state);
        state = next('e', state);
        return {
          state: state,
          value: true
        };

      case 'f':
        state = next('f', state);
        state = next('a', state);
        state = next('l', state);
        state = next('s', state);
        state = next('e', state);
        return {
          state: state,
          value: false
        };

      case 'n':
        state = next('n', state);
        state = next('u', state);
        state = next('l', state);
        state = next('l', state);
        return {
          state: state,
          value: null
        };

      case 'I':
        state = next('I', state);
        state = next('n', state);
        state = next('f', state);
        state = next('i', state);
        state = next('n', state);
        state = next('i', state);
        state = next('t', state);
        state = next('y', state);
        return {
          state: state,
          value: Infinity
        };

      case 'N':
        state = next('N', state);
        state = next('a', state);
        state = next('N', state);
        return {
          state: state,
          value: NaN
        };
    }

    error('Unexpected ' + renderChar(state.ch), state);
  },
      value,
      // Place holder for the value function.
  array = function array(state, continuation) {
    // Parse an array value.
    var array = [];
    var idx = 0;

    if (state.ch === '[') {
      state = next('[', state);
      state = white(state);

      while (state.ch) {
        if (state.ch === ']') {
          state = next(']', state);
          return {
            state: state,
            value: array
          }; // Potentially empty array
        } // ES5 allows omitting elements in arrays, e.g. [,] and
        // [,null]. We don't allow this in JSON5.


        if (state.ch === ',') {
          error('Missing array element');
        } else {
          if (continuation) {
            var res = continuation(idx, state);
            array.push(res.value);
            state = res.state;
          } else {
            var valueAndState = value(state);
            array.push(valueAndState.value);
            state = valueAndState.state;
          }

          idx = idx + 1;
        }

        state = white(state); // If there's no comma after this value, this needs to
        // be the end of the array.

        if (state.ch !== ',') {
          state = next(']', state);
          return {
            state: state,
            value: array
          };
        }

        state = next(',', state);
        state = white(state);
      }
    }

    error('Bad array');
  },
      object = function object(state, continuation) {
    // Parse an object value.
    var key,
        object = {};

    if (state.ch === '{') {
      state = next('{', state);
      state = white(state);

      while (state.ch) {
        if (state.ch === '}') {
          state = next('}', state);
          return {
            state: state,
            value: object
          }; // Potentially empty object
        } // Keys can be unquoted. If they are, they need to be
        // valid JS identifiers.


        var keyAndState;
        var keyState = state;

        if (state.ch === '"' || state.ch === "'") {
          keyAndState = string(state);
        } else {
          keyAndState = identifier(state);
        }

        key = keyAndState.value;
        state = keyAndState.state;
        state = white(state);
        state = next(':', state);

        if (continuation) {
          var res = continuation(key, state, keyState);
          object[key] = res.value;
          state = res.state;
        } else {
          var valueAndState = value(state);
          object[key] = valueAndState.value;
          state = valueAndState.state;
        }

        state = white(state); // If there's no comma after this pair, this needs to be
        // the end of the object.

        if (state.ch !== ',') {
          state = next('}', state);
          return {
            state: state,
            value: object
          };
        }

        state = next(',', state);
        state = white(state);
      }
    }

    error('Bad object', state);
  };

  value = function value(state) {
    // Parse a JSON value. It could be an object, an array, a string, a number,
    // or a word.
    state = white(state);

    switch (state.ch) {
      case '{':
        return object(state);

      case '[':
        return array(state);

      case '"':
      case "'":
        return string(state);

      case '-':
      case '+':
      case '.':
        return number(state);

      default:
        return state.ch >= '0' && state.ch <= '9' ? number(state) : word(state);
    }
  }; // Return the json_parse function. It will have access to all of the above
  // functions and variables.


  return function (source, node) {
    var state = {
      at: 0,
      text: String(source),
      lineNumber: 1,
      columnNumber: 1,
      ch: ' '
    };

    if (node) {
      state = white(state);
      var context = new Context(state);
      var result = node.validate(context);
      state = result.context.state;
      result = result.value;
    } else {
      var resultAndState = value(state, context);
      var result = resultAndState.value;
      state = resultAndState.state;
    }

    state = white(state);

    if (state.ch) {
      error('Syntax error', state);
    }

    return result;
  };
}();

function validate(schema, value) {
  return parse(value, schema);
}
