'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = getValueType;

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getValueType(value) {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  if ((0, _lodash2.default)(value)) {
    return 'map';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return typeof value === 'undefined' ? 'undefined' : _typeof(value);
  }

  if (typeof value !== 'undefined' && typeof value.length !== 'undefined') {
    return 'array';
  }

  return 'string';
}