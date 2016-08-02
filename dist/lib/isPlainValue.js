'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isPlainValue;
function isPlainValue(value) {
  if (value === null) {
    return true;
  }

  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'string':
    case 'number':
    case 'boolean':
      return true;
    default:
      return false;
  }
}