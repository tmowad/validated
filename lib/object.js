"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _utils = require("./utils");

var _schema = require("./schema");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Context =
/*#__PURE__*/
function (_ContextBase) {
  _inherits(Context, _ContextBase);

  function Context(value) {
    var _this;

    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Context);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Context).call(this, message, parent));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "value", void 0);

    _this.value = value;
    return _this;
  }

  _createClass(Context, [{
    key: "buildMapping",
    value: function buildMapping(validate) {
      if (!(0, _utils.isObject)(this.value)) {
        throw this.error("Expected a mapping but got ".concat((0, _utils.typeOf)(this.value)));
      }

      var keys = Object.keys(this.value);
      var value = {};

      for (var i = 0; i < keys.length; i++) {
        var _key = keys[i];
        var valueContext = new Context(this.value[_key], "While validating value at key \"".concat(_key, "\""), this);

        var _keyContext = new Context(_key, "While validating key \"".concat(_key, "\""), this);

        var res = validate(valueContext, _key, _keyContext);
        value[_key] = res.value;
      }

      return {
        value: value,
        context: NULL_CONTEXT
      };
    }
  }, {
    key: "buildSequence",
    value: function buildSequence(validate) {
      if (!Array.isArray(this.value)) {
        throw this.error("Expected an array but got ".concat((0, _utils.typeOf)(this.value)));
      }

      var value = [];

      for (var i = 0; i < this.value.length; i++) {
        var _context = new Context(this.value[i], "While validating value at index ".concat(i), this);

        var res = validate(_context);
        value[i] = res.value;
      }

      return {
        value: value,
        context: NULL_CONTEXT
      };
    }
  }, {
    key: "unwrap",
    value: function unwrap(validate) {
      var value = validate(this.value);
      return {
        value: value,
        context: NULL_CONTEXT
      };
    }
  }]);

  return Context;
}(_schema.Context);

var NULL_CONTEXT = new Context(null);

function validate(schema, value) {
  var context = new Context(value);
  return schema.validate(context).value;
}
