"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.message = message;
exports.AlternativeMessage = exports.Message = void 0;

var _indentStringCopy = _interopRequireDefault(require("./indent-string-copy.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NEWLINE = '\n';
var INDENT = '  ';

var Message =
/*#__PURE__*/
function () {
  function Message(message) {
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Message);

    _defineProperty(this, "message", void 0);

    _defineProperty(this, "children", void 0);

    this.message = message;
    this.children = children;
  }

  _createClass(Message, [{
    key: "toString",
    value: function toString() {
      if (this.message === null) {
        return this.children.map(function (m) {
          return m.toString();
        }).join(NEWLINE);
      } else {
        return [this.message].concat(this.children.map(function (m) {
          return (0, _indentStringCopy.default)(m.toString(), 1, INDENT);
        })).join(NEWLINE);
      }
    }
  }]);

  return Message;
}();

exports.Message = Message;

var AlternativeMessage =
/*#__PURE__*/
function (_Message) {
  _inherits(AlternativeMessage, _Message);

  function AlternativeMessage(alternatives) {
    var _this;

    _classCallCheck(this, AlternativeMessage);

    var children = [''];
    alternatives.forEach(function (line) {
      children.push(line);
      children.push('');
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(AlternativeMessage).call(this, AlternativeMessage.DESCRIPTION, children));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "alternatives", void 0);

    _this.alternatives = alternatives;
    return _this;
  }

  return AlternativeMessage;
}(Message);

exports.AlternativeMessage = AlternativeMessage;

_defineProperty(AlternativeMessage, "DESCRIPTION", 'Either:');

function message(message) {
  var inChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var children = Array.isArray(inChildren) ? inChildren : [inChildren];

  if (children.length === 1 && message == null) {
    return children[0];
  }

  return new Message(message, children);
}
