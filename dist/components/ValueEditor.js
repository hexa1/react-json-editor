'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = require('react');

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boolOptions = [{
  value: 'true', label: 'True'
}, {
  value: 'false', label: 'False'
}];

// ReactSelect doesn't like boolean values :-\
function convertToActualBool(string) {
  return string === 'true';
}

function validateKeyPress(evt, fieldValue, valueType) {
  // only allow digits and one decimal for numbers
  if (valueType === 'number') {
    if (/\./.test(String.fromCharCode(evt.charCode))) {
      if (String(fieldValue).indexOf('.') > -1) {
        evt.preventDefault();
      } else {
        return;
      }
    }

    if (/^\d+$/.test(String.fromCharCode(evt.charCode)) === false) {
      evt.preventDefault();
    }
  }
}

function ValueEditor(props) {
  var _onChange = props.onChange;
  var fieldValue = props.fieldValue;

  var valueType = (0, _lib.getValueType)(fieldValue);

  if (valueType === 'boolean') {
    return React.createElement(
      'span',
      { className: 'bool-selector' },
      React.createElement(_reactSelect2.default, {
        value: String(fieldValue),
        options: boolOptions,
        clearable: false,
        searchable: false,
        onChange: function onChange(val) {
          return _onChange(convertToActualBool(val));
        }
      })
    );
  }

  return React.createElement('input', {
    type: 'text',
    className: 'form-control',
    value: fieldValue,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    },
    onKeyPress: function onKeyPress(evt) {
      return validateKeyPress(evt, fieldValue, valueType);
    }
  });
}

exports.default = ValueEditor;
ValueEditor.propTypes = {
  fieldValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array, _react.PropTypes.object, _react.PropTypes.number, _react.PropTypes.bool]),
  onChange: _react.PropTypes.func
};