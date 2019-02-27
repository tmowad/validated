"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationError = validationError;
exports.constant = constant;
exports.mapping = mapping;
exports.object = object;
exports.partialObject = partialObject;
exports.arrayOf = arrayOf;
exports.sequence = sequence;
exports.maybe = maybe;
exports.enumeration = enumeration;
exports.recur = recur;
exports.RecursiveNode = exports.boolean = exports.BooleanNode = exports.number = exports.NumberNode = exports.string = exports.StringNode = exports.oneOf = exports.OneOfNode = exports.EnumerationNode = exports.MaybeNode = exports.SequenceNode = exports.ObjectNode = exports.MappingNode = exports.ConstantNode = exports.any = exports.AnyNode = exports.RefineNode = exports.Node = exports.ValidationError = exports.Context = void 0;

var _message2 = require("./message");

var _utils = require("./utils");

var _customErrorInstance = _interopRequireDefault(require("custom-error-instance"));

var _invariant = _interopRequireDefault(require("invariant"));

var _levenshteinEditDistance = _interopRequireDefault(require("levenshtein-edit-distance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Context =
/*#__PURE__*/
function () {
  function Context() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Context);

    _defineProperty(this, "parent", void 0);

    _defineProperty(this, "message", void 0);

    this.message = message;
    this.parent = parent;
  }

  _createClass(Context, [{
    key: "buildMapping",
    value: function buildMapping(_validateValue) {
      throw new Error('not implemented');
    }
  }, {
    key: "buildSequence",
    value: function buildSequence(_validateValue) {
      throw new Error('not implemented');
    }
  }, {
    key: "unwrap",
    value: function unwrap(_validate) {
      throw new Error('not implemented');
    }
  }, {
    key: "buildMessage",
    value: function buildMessage(originalMessage, _contextMessages) {
      return originalMessage;
    }
  }, {
    key: "error",
    value: function error(inMessage) {
      var context = this;
      var contextMessages = [];

      do {
        if (context.message) {
          contextMessages.push(context.message);
        }

        context = context.parent;
      } while (context);

      var originalMessage = this.buildMessage(inMessage, contextMessages);
      return validationError(originalMessage, contextMessages);
    }
  }]);

  return Context;
}();

exports.Context = Context;

var NullContext =
/*#__PURE__*/
function (_Context) {
  _inherits(NullContext, _Context);

  function NullContext() {
    _classCallCheck(this, NullContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(NullContext).apply(this, arguments));
  }

  _createClass(NullContext, [{
    key: "buildMapping",
    value: function buildMapping(_validateValue) {
      throw this.error('Expected a mapping value but got undefined');
    }
  }, {
    key: "buildSequence",
    value: function buildSequence(_validateValue) {
      throw this.error('Expected an array value but got undefined');
    }
  }, {
    key: "unwrap",
    value: function unwrap(validate) {
      var value = validate(undefined);
      return {
        value: value,
        context: this
      };
    }
  }, {
    key: "buildMessage",
    value: function buildMessage(originalMessage, contextMessages) {
      if (this.parent) {
        return this.parent.buildMessage(originalMessage, contextMessages);
      } else {
        return originalMessage;
      }
    }
  }]);

  return NullContext;
}(Context);

var ValidationError = (0, _customErrorInstance.default)('ValidationError');
exports.ValidationError = ValidationError;

ValidationError.prototype.toString = function () {
  return this.message;
};

ValidationError.prototype.withContext = function () {
  var _this$contextMessages;

  var error = validationError(this.originalMessage, (_this$contextMessages = this.contextMessages).concat.apply(_this$contextMessages, arguments));
  return error;
};

function validationError(originalMessage, contextMessages) {
  var messages = [originalMessage].concat(contextMessages);
  var message = messages.join('\n');
  return new ValidationError({
    message: message,
    messages: messages,
    originalMessage: originalMessage,
    contextMessages: contextMessages
  });
}

var Node =
/*#__PURE__*/
function () {
  function Node() {
    _classCallCheck(this, Node);
  }

  _createClass(Node, [{
    key: "validate",
    value: function validate(_context) {
      var message = "".concat(this.constructor.name, ".validate(context) is not implemented");
      throw new Error(message);
    }
  }, {
    key: "andThen",
    value: function andThen(refine) {
      var node = new RefineNode(this, refine);
      return node;
    }
  }]);

  return Node;
}();

exports.Node = Node;

var RefineNode =
/*#__PURE__*/
function (_Node) {
  _inherits(RefineNode, _Node);

  function RefineNode(validator, refine) {
    var _this;

    _classCallCheck(this, RefineNode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RefineNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "validator", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refine", void 0);

    _this.validator = validator;
    _this.refine = refine;
    return _this;
  }

  _createClass(RefineNode, [{
    key: "validate",
    value: function validate(context) {
      var _this$validator$valid = this.validator.validate(context),
          value = _this$validator$valid.value,
          nextContext = _this$validator$valid.context;

      var nextValue = this.refine(value, context.error.bind(context));
      return {
        value: nextValue,
        context: nextContext
      };
    }
  }]);

  return RefineNode;
}(Node);

exports.RefineNode = RefineNode;

var AnyNode =
/*#__PURE__*/
function (_Node2) {
  _inherits(AnyNode, _Node2);

  function AnyNode() {
    _classCallCheck(this, AnyNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(AnyNode).apply(this, arguments));
  }

  _createClass(AnyNode, [{
    key: "validate",
    value: function validate(context) {
      return context.unwrap(function (value) {
        if (value == null) {
          var repr = value === null ? 'null' : 'undefined';
          throw context.error("Expected a value but got ".concat(repr));
        }

        return value;
      });
    }
  }]);

  return AnyNode;
}(Node);

exports.AnyNode = AnyNode;
var any = new AnyNode();
exports.any = any;

var ConstantNode =
/*#__PURE__*/
function (_Node3) {
  _inherits(ConstantNode, _Node3);

  function ConstantNode(value, eq) {
    var _this2;

    _classCallCheck(this, ConstantNode);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ConstantNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "value", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "eq", void 0);

    _this2.value = value;
    _this2.eq = eq;
    return _this2;
  }

  _createClass(ConstantNode, [{
    key: "validate",
    value: function validate(context) {
      var _this3 = this;

      return context.unwrap(function (value) {
        if (!_this3.eq(value, _this3.value)) {
          throw context.error("Expected ".concat(JSON.stringify(_this3.value), " but got ").concat(JSON.stringify(value)));
        }

        return value;
      });
    }
  }]);

  return ConstantNode;
}(Node);

exports.ConstantNode = ConstantNode;

function constant(value) {
  var eq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v1, v2) {
    return v1 === v2;
  };
  return new ConstantNode(value, eq);
}

var MappingNode =
/*#__PURE__*/
function (_Node4) {
  _inherits(MappingNode, _Node4);

  function MappingNode(valueNode) {
    var _this4;

    _classCallCheck(this, MappingNode);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(MappingNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this4)), "valueNode", void 0);

    _this4.valueNode = valueNode;
    return _this4;
  }

  _createClass(MappingNode, [{
    key: "validate",
    value: function validate(context) {
      var _this5 = this;

      return context.buildMapping(function (context) {
        return _this5.valueNode.validate(context);
      });
    }
  }]);

  return MappingNode;
}(Node);

exports.MappingNode = MappingNode;

function mapping() {
  var valueNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any;
  return new MappingNode(valueNode);
}

var ObjectNode =
/*#__PURE__*/
function (_Node5) {
  _inherits(ObjectNode, _Node5);

  // eslint-disable-line no-undef
  function ObjectNode(values) {
    var _this6;

    var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, ObjectNode);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ObjectNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this6)), "values", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this6)), "valuesKeys", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this6)), "defaults", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this6)), "options", void 0);

    _this6.values = values;
    _this6.valuesKeys = Object.keys(values);
    _this6.defaults = defaults || {};
    _this6.options = options;
    return _this6;
  }

  _createClass(ObjectNode, [{
    key: "validate",
    value: function validate(context) {
      var _this7 = this;

      // eslint-disable-line no-undef
      var res = context.buildMapping(function (valueContext, key, keyContext) {
        if (_this7.values[key] == undefined) {
          if (!_this7.options.allowExtra) {
            var suggestion = _this7._guessSuggestion(key);

            if (suggestion) {
              throw keyContext.error("Unexpected key: \"".concat(key, "\", did you mean \"").concat(suggestion, "\"?"));
            } else {
              throw keyContext.error("Unexpected key: \"".concat(key, "\""));
            }
          } else {
            return valueContext.unwrap(function (value) {
              return value;
            });
          }
        }

        var value = _this7.values[key].validate(valueContext);

        return value;
      });
      var value = res.value;

      for (var _key in this.values) {
        if (this.values.hasOwnProperty(_key)) {
          if (value[_key] === undefined) {
            if (this.defaults[_key] === undefined) {
              var _message = "While validating missing value for key \"".concat(_key, "\"");

              _message = context.buildMessage(_message, []);
              var nullContext = new NullContext(_message, context);

              var _this$values$_key$val = this.values[_key].validate(nullContext),
                  missingValue = _this$values$_key$val.value;

              if (missingValue !== undefined) {
                value[_key] = missingValue;
              }
            } else {
              value[_key] = this.defaults[_key];
            }
          }
        }
      }

      return _objectSpread({}, res, {
        value: value
      });
    }
  }, {
    key: "_compareSuggestions",
    value: function _compareSuggestions(a, b) {
      return a.distance - b.distance;
    }
  }, {
    key: "_guessSuggestion",
    value: function _guessSuggestion(key) {
      var suggestions = this.valuesKeys.map(function (suggestion) {
        return {
          distance: (0, _levenshteinEditDistance.default)(suggestion, key),
          suggestion: suggestion
        };
      });
      var suggestion = suggestions.sort(this._compareSuggestions)[0];

      if (suggestion.distance === key.length) {
        return null;
      } else {
        return suggestion.suggestion;
      }
    }
  }]);

  return ObjectNode;
}(Node);

exports.ObjectNode = ObjectNode;

function object(values, defaults) {
  // eslint-disable-line no-undef
  return new ObjectNode(values, defaults, {
    allowExtra: false
  });
}

function partialObject(values, defaults) {
  // eslint-disable-line no-undef
  return new ObjectNode(values, defaults, {
    allowExtra: true
  });
}

var SequenceNode =
/*#__PURE__*/
function (_Node6) {
  _inherits(SequenceNode, _Node6);

  function SequenceNode() {
    var _this8;

    var valueNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any;

    _classCallCheck(this, SequenceNode);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(SequenceNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this8)), "valueNode", void 0);

    _this8.valueNode = valueNode;
    return _this8;
  }

  _createClass(SequenceNode, [{
    key: "validate",
    value: function validate(context) {
      var _this9 = this;

      return context.buildSequence(function (context) {
        return _this9.valueNode.validate(context);
      });
    }
  }]);

  return SequenceNode;
}(Node);

exports.SequenceNode = SequenceNode;

function arrayOf() {
  var valueNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any;
  return new SequenceNode(valueNode);
} // Kept for backwards compatibility. Use `arrayOf` instead.


function sequence() {
  var valueNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : any;
  return new SequenceNode(valueNode);
}

var MaybeNode =
/*#__PURE__*/
function (_Node7) {
  _inherits(MaybeNode, _Node7);

  function MaybeNode(valueNode) {
    var _this10;

    _classCallCheck(this, MaybeNode);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(MaybeNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this10)), "valueNode", void 0);

    _this10.valueNode = valueNode;
    return _this10;
  }

  _createClass(MaybeNode, [{
    key: "validate",
    value: function validate(context) {
      var _this11 = this;

      return context.unwrap(function (value) {
        if (value == null) {
          return value;
        }

        return _this11.valueNode.validate(context).value;
      });
    }
  }]);

  return MaybeNode;
}(Node);

exports.MaybeNode = MaybeNode;

function maybe(valueNode) {
  return new MaybeNode(valueNode);
}

var EnumerationNode =
/*#__PURE__*/
function (_Node8) {
  _inherits(EnumerationNode, _Node8);

  function EnumerationNode(values) {
    var _this12;

    _classCallCheck(this, EnumerationNode);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(EnumerationNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this12)), "values", void 0);

    _this12.values = values;
    return _this12;
  }

  _createClass(EnumerationNode, [{
    key: "validate",
    value: function validate(context) {
      var _this13 = this;

      return context.unwrap(function (value) {
        for (var _i = 0; _i < _this13.values.length; _i++) {
          if (value === _this13.values[_i]) {
            return value;
          }
        }

        var expectation = _this13.values.map(function (v) {
          return JSON.stringify(v);
        }).join(', ');

        var repr = JSON.stringify(value);
        throw context.error("Expected value to be one of ".concat(expectation, " but got ").concat(repr));
      });
    }
  }]);

  return EnumerationNode;
}(Node);

exports.EnumerationNode = EnumerationNode;

function enumeration() {
  for (var _len = arguments.length, values = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    values[_key2] = arguments[_key2];
  }

  var node = new EnumerationNode(values);
  return node;
}

var OneOfNode =
/*#__PURE__*/
function (_Node9) {
  _inherits(OneOfNode, _Node9);

  function OneOfNode(nodes) {
    var _this14;

    _classCallCheck(this, OneOfNode);

    _this14 = _possibleConstructorReturn(this, _getPrototypeOf(OneOfNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this14)), "nodes", void 0);

    _this14.nodes = nodes;
    return _this14;
  }

  _createClass(OneOfNode, [{
    key: "validate",
    value: function validate(context) {
      var errors = [];

      for (var _i2 = 0; _i2 < this.nodes.length; _i2++) {
        try {
          return this.nodes[_i2].validate(context);
        } catch (error) {
          if (error instanceof ValidationError) {
            errors.push(error);
            continue;
          } else {
            throw error;
          }
        }
      }

      (0, _invariant.default)(errors.length > 0, 'Impossible happened');
      throw optimizeOneOfError(errors);
    }
  }]);

  return OneOfNode;
}(Node);

exports.OneOfNode = OneOfNode;

function oneOf_() {
  for (var _len2 = arguments.length, nodes = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
    nodes[_key3] = arguments[_key3];
  }

  if (nodes.length === 1) {
    return nodes[0];
  }

  var node = new OneOfNode(nodes);
  return node;
}

var oneOf = oneOf_;
exports.oneOf = oneOf;

function optimizeOneOfError(errors) {
  var sections = errors.map(function (error) {
    return error.messages;
  });
  sections = sections.map(function (messages) {
    if (messages[0] instanceof _message2.AlternativeMessage) {
      return explode(messages[0].alternatives, messages.slice(1));
    } else {
      return [messages];
    }
  });
  sections = (0, _utils.flatten)(sections);
  var maxWeight = Math.max.apply(null, sections.map(function (message) {
    return weightMessage(message);
  }));
  sections = sections.filter(function (message) {
    return weightMessage(message) === maxWeight;
  });

  if (sections.length === 1) {
    return validationError(sections[0][0], sections[0].slice(1));
  }

  sections = sections.map(function (messages) {
    return messages.slice(0).reverse();
  }); // Collect same lines into a separate section

  var same = [];
  var i = 0;

  while (!sections.every(function (lines) {
    return lines[i] === undefined;
  })) {
    if (sections.every(function (lines) {
      return lines[i] === sections[0][i];
    })) {
      same.unshift(sections[0][i]);
    }

    i++;
  }

  sections = sections.map(function (lines) {
    return (0, _message2.message)(null, lines.slice(same.length).reverse());
  }); // Collect alternatives

  var alternatives = [];
  sections.forEach(function (lines) {
    if (!alternatives.find(function (msg) {
      return sameMessage(msg, lines);
    })) {
      alternatives.push((0, _message2.message)(null, lines));
    }
  });
  return validationError(new _message2.AlternativeMessage(alternatives), same);
}

function sameMessage(a, b) {
  if (a === b) {
    return true;
  } else if (a instanceof _message2.Message) {
    return b instanceof _message2.Message && sameMessage(a.message, b.message) && a.children.length === b.children.length && a.children.every(function (child, idx) {
      return sameMessage(child, b.children[idx]);
    });
  }
}

function weightMessage(msg) {
  if (msg instanceof _message2.Message) {
    return msg.children.length;
  } else if (Array.isArray(msg)) {
    return msg.length;
  } else {
    return 1;
  }
}

var StringNode =
/*#__PURE__*/
function (_Node10) {
  _inherits(StringNode, _Node10);

  function StringNode() {
    _classCallCheck(this, StringNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(StringNode).apply(this, arguments));
  }

  _createClass(StringNode, [{
    key: "validate",
    value: function validate(context) {
      return context.unwrap(function (value) {
        if (typeof value !== 'string') {
          throw context.error("Expected value of type string but got ".concat((0, _utils.typeOf)(value)));
        }

        return value;
      });
    }
  }]);

  return StringNode;
}(Node);

exports.StringNode = StringNode;
var string = new StringNode();
exports.string = string;

var NumberNode =
/*#__PURE__*/
function (_Node11) {
  _inherits(NumberNode, _Node11);

  function NumberNode() {
    _classCallCheck(this, NumberNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(NumberNode).apply(this, arguments));
  }

  _createClass(NumberNode, [{
    key: "validate",
    value: function validate(context) {
      return context.unwrap(function (value) {
        if (typeof value !== 'number') {
          throw context.error("Expected value of type number but got ".concat((0, _utils.typeOf)(value)));
        }

        return value;
      });
    }
  }]);

  return NumberNode;
}(Node);

exports.NumberNode = NumberNode;
var number = new NumberNode();
exports.number = number;

var BooleanNode =
/*#__PURE__*/
function (_Node12) {
  _inherits(BooleanNode, _Node12);

  function BooleanNode() {
    _classCallCheck(this, BooleanNode);

    return _possibleConstructorReturn(this, _getPrototypeOf(BooleanNode).apply(this, arguments));
  }

  _createClass(BooleanNode, [{
    key: "validate",
    value: function validate(context) {
      return context.unwrap(function (value) {
        if (typeof value !== 'boolean') {
          throw context.error("Expected value of type boolean but got ".concat((0, _utils.typeOf)(value)));
        }

        return value;
      });
    }
  }]);

  return BooleanNode;
}(Node);

exports.BooleanNode = BooleanNode;
var boolean = new BooleanNode();
exports.boolean = boolean;

var RecursiveNode =
/*#__PURE__*/
function (_Node13) {
  _inherits(RecursiveNode, _Node13);

  function RecursiveNode(thunk) {
    var _this15;

    _classCallCheck(this, RecursiveNode);

    _this15 = _possibleConstructorReturn(this, _getPrototypeOf(RecursiveNode).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this15)), "node", void 0);

    _this15.node = thunk(_assertThisInitialized(_assertThisInitialized(_this15)));
    return _this15;
  }

  _createClass(RecursiveNode, [{
    key: "validate",
    value: function validate(context) {
      return this.node.validate(context);
    }
  }]);

  return RecursiveNode;
}(Node);

exports.RecursiveNode = RecursiveNode;

function recur(thunk) {
  return new RecursiveNode(thunk);
}

function explode(variations, rest) {
  var result = [];

  for (var _i3 = 0; _i3 < variations.length; _i3++) {
    result.push([variations[_i3]].concat(rest));
  }

  return result;
}
