"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = void 0;

var _schema = require("./schema");

/**
 * @copyright 2016-present, Andrey Popp <8mayday@gmail.com>
 * 
 */
var asAnyNode = function asAnyNode(node) {
  return node;
};

var stringSchema = (0, _schema.constant)('string').andThen(function (_) {
  return _schema.string;
});
var numberSchema = (0, _schema.constant)('number').andThen(function (_) {
  return _schema.number;
});
var booleanSchema = (0, _schema.constant)('boolean').andThen(function (_) {
  return _schema.boolean;
});
var anySchema = (0, _schema.constant)('any').andThen(function (_) {
  return asAnyNode(_schema.any);
});
var enumerationSchema = (0, _schema.object)({
  enumeration: (0, _schema.sequence)(_schema.any)
}).andThen(function (obj) {
  return (0, _schema.enumeration)(obj.enumeration);
});
var constantSchema = (0, _schema.object)({
  constant: _schema.any
}).andThen(function (obj) {
  return (0, _schema.constant)(obj.constant);
});

var maybeSchema = function maybeSchema(schema) {
  return (0, _schema.object)({
    maybe: schema
  }).andThen(function (obj) {
    return (0, _schema.maybe)(obj.maybe);
  });
};

var mappingSchema = function mappingSchema(schema) {
  return (0, _schema.object)({
    mapping: schema
  }).andThen(function (obj) {
    return (0, _schema.mapping)(obj.mapping);
  });
};

var sequenceSchema = function sequenceSchema(schema) {
  return (0, _schema.object)({
    sequence: schema
  }).andThen(function (obj) {
    return (0, _schema.sequence)(obj.sequence);
  });
};

var objectSchema = function objectSchema(schema) {
  return (0, _schema.object)({
    object: (0, _schema.mapping)(schema),
    defaults: (0, _schema.maybe)(_schema.any)
  }).andThen(function (obj) {
    return (0, _schema.object)(obj.object, obj.defaults);
  });
};

var partialObjectSchema = function partialObjectSchema(schema) {
  return (0, _schema.object)({
    partialObject: (0, _schema.mapping)(schema),
    defaults: (0, _schema.maybe)(_schema.any)
  }).andThen(function (obj) {
    return (0, _schema.partialObject)(obj.partialObject, obj.defaults);
  });
};

var schemaSchema = (0, _schema.recur)(function (schema) {
  return (0, _schema.oneOf)(stringSchema, numberSchema, booleanSchema, anySchema, enumerationSchema, constantSchema, maybeSchema(schema), mappingSchema(schema), sequenceSchema(schema), objectSchema(schema), partialObjectSchema(schema));
});
var schema = schemaSchema;
exports.schema = schema;
