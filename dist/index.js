'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorState = exports.default = undefined;

var _EditorState = require('./lib/EditorState');

var _EditorState2 = _interopRequireDefault(_EditorState);

var _Editor = require('./components/Editor');

var _Editor2 = _interopRequireDefault(_Editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Editor2.default;
exports.EditorState = _EditorState2.default;