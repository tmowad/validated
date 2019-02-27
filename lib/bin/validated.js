#!/usr/bin/env node

/**
 * @copyright 2016-present, Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _invariant = _interopRequireDefault(require("invariant"));

var _commander = _interopRequireDefault(require("commander"));

var _package = _interopRequireDefault(require("../../package.json"));

var _schema = require("../schema");

var repr = _interopRequireWildcard(require("../repr"));

var json5 = _interopRequireWildcard(require("../json5"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var args = _commander.default.version(_package.default.version).command('validated <schema> <config>').parse(process.argv);

var _args$args = _slicedToArray(args.args, 2),
    schema = _args$args[0],
    config = _args$args[1];

if (!schema) {
  error('missing <schema> argument');
}

if (!config) {
  error('missing <config> argument');
}

function error(message) {
  console.error('error: ' + message); // eslint-disable-line no-console

  process.exit(1);
}

var schemaSrc = _fs.default.readFileSync(schema, 'utf8');

var schemaNode;

try {
  schemaNode = json5.validate(repr.schema, schemaSrc);
} catch (error) {
  if (error instanceof _schema.ValidationError) {
    console.error(error.message); // eslint-disable-line no-console

    console.error("While validating schema \"".concat(schema, "\"")); // eslint-disable-line no-console

    process.exit(1);
  } else {
    throw error;
  }
}

(0, _invariant.default)(schemaNode != null, 'Impossible');

var configSrc = _fs.default.readFileSync(config, 'utf8');

var configValidated = undefined;

try {
  configValidated = json5.validate(schemaNode, configSrc);
} catch (error) {
  if (error instanceof _schema.ValidationError) {
    console.error(error.message); // eslint-disable-line no-console

    console.error("While validating \"".concat(config, "\"")); // eslint-disable-line no-console

    process.exit(1);
  } else {
    throw error;
  }
}

console.log(JSON.stringify(configValidated, null, 2)); // eslint-disable-line no-console
