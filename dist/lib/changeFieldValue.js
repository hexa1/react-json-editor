'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = changeFieldValue;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.get');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function changeFieldValue(json, path, value) {
  var previous = (0, _lodash6.default)(json, path);
  var cloned = (0, _lodash2.default)(json);

  (0, _lodash4.default)(cloned, path, value);

  return {
    previous: previous,
    json: cloned
  };
}