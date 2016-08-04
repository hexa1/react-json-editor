'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addArrayElement;

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _changeFieldValue = require('./changeFieldValue');

var _changeFieldValue2 = _interopRequireDefault(_changeFieldValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addArrayElement(json, path, value) {
  var previous = (0, _lodash2.default)(json, path);

  return {
    json: (0, _changeFieldValue2.default)(json, path, previous.concat(value)).json,
    previous: previous
  };
}