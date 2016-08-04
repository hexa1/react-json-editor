'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addMapElement;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

var _changeFieldValue = require('./changeFieldValue');

var _changeFieldValue2 = _interopRequireDefault(_changeFieldValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addMapElement(json, path, name, value) {
  if (path && path.length) {
    // adding element to sub map - not root json object
    var cloned = (0, _lodash2.default)(json);
    var previous = (0, _lodash4.default)(cloned, path);

    if (typeof previous[name] !== 'undefined') {
      return false;
    }

    // get a snapshot of the previous value before we modify it
    var clonedPrevious = (0, _lodash2.default)(previous);

    previous[name] = value;

    return {
      json: (0, _changeFieldValue2.default)(json, path, previous).json,
      previous: clonedPrevious
    };
  } else {
    // adding element to root json object
    if (typeof json[name] !== 'undefined') {
      return false;
    }

    return {
      json: (0, _changeFieldValue2.default)(json, name, value).json,
      previous: json
    };
  }
}