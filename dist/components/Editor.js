'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.clonedeep');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.get');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.set');

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require('lodash.unset');

var _lodash10 = _interopRequireDefault(_lodash9);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

var _AddElementButton = require('./AddElementButton');

var _AddElementButton2 = _interopRequireDefault(_AddElementButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JSONEditor = function (_Component) {
  _inherits(JSONEditor, _Component);

  function JSONEditor(props) {
    _classCallCheck(this, JSONEditor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JSONEditor).call(this, props));

    _this.undoStack = [];
    _this.redoStack = [];

    _this.onFieldValueChange = _this.onFieldValueChange.bind(_this);
    _this.addArrayElement = _this.addArrayElement.bind(_this);
    _this.addMapElement = _this.addMapElement.bind(_this);
    _this.removeElement = _this.removeElement.bind(_this);
    _this.undo = _this.undo.bind(_this);
    _this.redo = _this.redo.bind(_this);
    return _this;
  }

  _createClass(JSONEditor, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        jsonEditor: {
          onFieldValueChange: this.onFieldValueChange,
          addArrayElement: this.addArrayElement,
          addMapElement: this.addMapElement,
          removeElement: this.removeElement
        }
      };
    }
  }, {
    key: 'parseJson',
    value: function parseJson() {
      var json = this.props.json;


      if (!json) {
        return {};
      }

      if ((0, _lodash2.default)(json)) {
        return json;
      }

      try {
        return JSON.parse(json);
      } catch (e) {
        return {};
      }
    }
  }, {
    key: 'onFieldValueChange',
    value: function onFieldValueChange(path, value) {
      var json = (0, _lodash4.default)(this.parseJson());

      this.undoStack.push({
        path: path,
        value: (0, _lodash6.default)(json, path)
      });

      (0, _lodash8.default)(json, path, value);
      this.redoStack = [];
      this.props.onChange(json);
    }
  }, {
    key: 'addArrayElement',
    value: function addArrayElement(path, value) {
      var json = (0, _lodash4.default)(this.parseJson());
      var currentVal = (0, _lodash6.default)(json, path);

      this.undoStack.push({
        path: path,
        value: currentVal
      });

      (0, _lodash8.default)(json, path, currentVal.concat(value));
      this.redoStack = [];
      this.props.onChange(json);
    }
  }, {
    key: 'addMapElement',
    value: function addMapElement(path, name, value) {
      var json = (0, _lodash4.default)(this.parseJson());
      var currentVal = (0, _lodash6.default)(json, path) || json;

      if (typeof currentVal[name] !== 'undefined') {
        return false;
      }

      // quick hack to fix an issue where adding an element to the root level
      // messes up undo/redo since there's no path
      if (path) {
        this.undoStack.push({
          path: path,
          value: (0, _lodash4.default)(currentVal)
        });
      }

      currentVal[name] = value;
      this.redoStack = [];
      this.props.onChange(json);

      return true;
    }
  }, {
    key: 'removeElement',
    value: function removeElement(path) {
      var json = (0, _lodash4.default)(this.parseJson());

      this.undoStack.push({
        path: path,
        value: (0, _lodash6.default)(json, path)
      });

      (0, _lodash10.default)(json, path);
      this.redoStack = [];
      this.props.onChange(json);
    }
  }, {
    key: 'undo',
    value: function undo() {
      var lastAction = this.undoStack.pop();
      var json = (0, _lodash4.default)(this.parseJson());

      this.redoStack.push({
        path: lastAction.path,
        value: (0, _lodash6.default)(json, lastAction.path)
      });

      (0, _lodash8.default)(json, lastAction.path, lastAction.value);
      this.props.onChange(json);
    }
  }, {
    key: 'redo',
    value: function redo() {
      var lastAction = this.redoStack.pop();
      var json = (0, _lodash4.default)(this.parseJson());

      this.undoStack.push({
        path: lastAction.path,
        value: (0, _lodash6.default)(json, lastAction.path)
      });

      (0, _lodash8.default)(json, lastAction.path, lastAction.value);
      this.props.onChange(json);
    }
  }, {
    key: 'render',
    value: function render() {
      var json = this.parseJson();

      return React.createElement(
        'div',
        { className: 'json-editor' },
        Object.keys(json).map(function (key) {
          if (typeof json[key] === 'undefined') {
            return null;
          }

          return React.createElement(_Field2.default, { key: key, fieldKey: key, fieldValue: json[key] });
        }),
        React.createElement(
          'div',
          { className: 'editor-actions' },
          React.createElement(_AddElementButton2.default, { path: '' }),
          this.undoStack.length > 0 && React.createElement(
            'button',
            { className: 'btn default btn-xs', type: 'button', onClick: this.undo },
            React.createElement('i', { className: 'fa fa-undo' }),
            'Undo'
          ),
          this.redoStack.length > 0 && React.createElement(
            'button',
            { className: 'btn default btn-xs', type: 'button', onClick: this.redo },
            React.createElement('i', { className: 'fa fa-repeat' }),
            'Redo'
          )
        )
      );
    }
  }]);

  return JSONEditor;
}(_react.Component);

JSONEditor.propTypes = {
  json: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
  onChange: _react.PropTypes.func
};
JSONEditor.defaultProps = {
  onChange: function onChange() {}
};
JSONEditor.childContextTypes = {
  jsonEditor: _react.PropTypes.object
};
exports.default = JSONEditor;