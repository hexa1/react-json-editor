'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = coerceToType;

var _isPlainValue = require('./isPlainValue');

var _isPlainValue2 = _interopRequireDefault(_isPlainValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a current value, return a new value for the specified type
 * @param  {Any} value       Current value
 * @param  {String} nextType    The new type to return
 * @return {Any}             The new value
 */
function coerceToType(value, nextType) {
  switch (nextType) {
    case 'string':
      if ((0, _isPlainValue2.default)(value)) {
        return String(value);
      }

      return '';

    case 'boolean':
      return typeof value === 'boolean' ? value : true;

    case 'map':
      return {};

    case 'array':
      return [value];

    case 'number':
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
      }

      return 0;

    default:
      return null;
  }
}