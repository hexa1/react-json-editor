'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coerceToType = exports.getValueType = exports.isPlainValue = undefined;

var _isPlainValue2 = require('./isPlainValue');

var _isPlainValue3 = _interopRequireDefault(_isPlainValue2);

var _getValueType2 = require('./getValueType');

var _getValueType3 = _interopRequireDefault(_getValueType2);

var _coerceToType2 = require('./coerceToType');

var _coerceToType3 = _interopRequireDefault(_coerceToType2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.isPlainValue = _isPlainValue3.default;
exports.getValueType = _getValueType3.default;
exports.coerceToType = _coerceToType3.default;