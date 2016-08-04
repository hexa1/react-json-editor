'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeElement;

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeElement(json, path, isArrayElement) {
  var cloned = (0, _lodash2.default)(json);

  if (path.length === 1) {
    // removing from the root json object
    var previous = (0, _lodash2.default)(json[path[0]]);
    delete cloned[path[0]];

    return {
      json: cloned,
      previous: previous
    };
  } else {
    // removing from a sub object or array
    var beforePath = path.slice(0, path.length - 1);
    var elementKey = path[path.length - 1];
    var beforePathValue = (0, _lodash4.default)(cloned, beforePath);
    var clonedBeforePathValue = (0, _lodash2.default)(beforePathValue);

    if (isArrayElement) {
      beforePathValue.splice(elementKey, 1);
    } else {
      delete beforePathValue[elementKey];
    }

    return {
      json: cloned,
      previous: clonedBeforePathValue
    };
  }
}