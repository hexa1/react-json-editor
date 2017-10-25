'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');

var _OverlayTrigger2 = _interopRequireDefault(_OverlayTrigger);

var _Tooltip = require('react-bootstrap/lib/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _lib = require('../lib');

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

    var _this = _possibleConstructorReturn(this, (JSONEditor.__proto__ || Object.getPrototypeOf(JSONEditor)).call(this, props));

    _this.state = {
      editorState: new _lib.EditorState(props.json)
    };

    _this.onFieldValueChange = _this.onFieldValueChange.bind(_this);
    _this.addArrayElement = _this.addArrayElement.bind(_this);
    _this.addMapElement = _this.addMapElement.bind(_this);
    _this.removeElement = _this.removeElement.bind(_this);
    _this.createDropdown = _this.createDropdown.bind(_this);
    _this.createTooltip = _this.createTooltip.bind(_this);
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
          removeElement: this.removeElement,
          createDropdown: this.createDropdown,
          createTooltip: this.createTooltip
        }
      };
    }
  }, {
    key: 'onFieldValueChange',
    value: function onFieldValueChange(path, value) {
      var _this2 = this;

      var onChange = this.props.onChange;
      var editorState = this.state.editorState;


      this.setState({
        editorState: editorState.setFieldValue(path, value)
      }, function () {
        if (onChange) {
          onChange(_this2.state.editorState.getJson());
        }
      });
    }
  }, {
    key: 'addArrayElement',
    value: function addArrayElement(path, value) {
      var _this3 = this;

      var onChange = this.props.onChange;
      var editorState = this.state.editorState;


      this.setState({
        editorState: editorState.addArrayElement(path, value)
      }, function () {
        if (onChange) {
          onChange(_this3.state.editorState.getJson());
        }
      });
    }
  }, {
    key: 'addMapElement',
    value: function addMapElement(path, key, value) {
      var onChange = this.props.onChange;
      var editorState = this.state.editorState;


      var updatedState = editorState.addMapElement(path.concat(key), value);

      // addMapElement will return false if the key already exists
      if (!updatedState) return false;

      this.setState({
        editorState: updatedState
      });

      if (onChange) {
        onChange(updatedState.getJson());
      }

      return true;
    }
  }, {
    key: 'removeElement',
    value: function removeElement(path) {
      var _this4 = this;

      var onChange = this.props.onChange;
      var editorState = this.state.editorState;


      this.setState({
        editorState: editorState.removeElement(path)
      }, function () {
        if (onChange) {
          onChange(_this4.state.editorState.getJson());
        }
      });
    }
  }, {
    key: 'createDropdown',
    value: function createDropdown() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var value = arguments[1];
      var _onChange = arguments[2];
      var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var dropdownFactory = this.props.dropdownFactory;


      if (dropdownFactory && typeof dropdownFactory === 'function') {
        return dropdownFactory(options, value, _onChange, props);
      }

      return React.createElement(
        'select',
        _extends({ value: value, onChange: function onChange(evt) {
            return _onChange(evt.target.value);
          }, defaultValue: '' }, props),
        React.createElement(
          'option',
          { disabled: true, value: '' },
          props.placeholder
        ),
        options.map(function (opt, idx) {
          return React.createElement(
            'option',
            { value: opt.value, key: idx },
            opt.label
          );
        })
      );
    }
  }, {
    key: 'createTooltip',
    value: function createTooltip(tooltipText, triggerComponent) {
      var placement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
      var id = arguments[3];
      var tooltipFactory = this.props.tooltipFactory;


      if (tooltipFactory) {
        return tooltipFactory(tooltipText, triggerComponent, placement, id);
      } else {
        var tooltip = React.createElement(
          _Tooltip2.default,
          { id: id },
          tooltipText
        );
        return React.createElement(
          _OverlayTrigger2.default,
          { overlay: tooltip, placement: placement },
          triggerComponent
        );
      }
    }
  }, {
    key: 'undo',
    value: function undo() {
      this.setState({
        editorState: this.state.editorState.undo()
      });
    }
  }, {
    key: 'redo',
    value: function redo() {
      this.setState({
        editorState: this.state.editorState.redo()
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var editorState = this.state.editorState;

      var json = editorState.getJson();

      return React.createElement(
        'div',
        { className: 'json-editor' },
        Object.keys(json).map(function (key) {
          if (typeof json[key] === 'undefined') {
            return null;
          }

          return React.createElement(_Field2.default, {
            key: key,
            fieldKey: key,
            fieldValue: json[key],
            isArrayElement: (0, _lib.getValueType)(json) === 'array'
          });
        }),
        React.createElement(
          'div',
          { className: 'editor-actions' },
          React.createElement(_AddElementButton2.default, { path: [], fieldValue: json }),
          editorState.canUndo() && React.createElement(
            'button',
            { className: 'btn default btn-xs', type: 'button', onClick: this.undo },
            React.createElement('i', { className: 'fa fa-undo' }),
            'Undo'
          ),
          editorState.canRedo() && React.createElement(
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
  json: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string, _propTypes2.default.array]),
  onChange: _propTypes2.default.func,
  dropdownFactory: _propTypes2.default.func,
  tooltipFactory: _propTypes2.default.func
};
JSONEditor.defaultProps = {
  onChange: function onChange() {}
};
JSONEditor.childContextTypes = {
  jsonEditor: _propTypes2.default.object
};
exports.default = JSONEditor;