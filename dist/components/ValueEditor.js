'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = require('react');

var _lib = require('../lib');

var boolOptions = [{
  value: 'true', label: 'True'
}, {
  value: 'false', label: 'False'
}];

// values in the bool options are strings for ease of use across dropdown components
// convert the value back to an actual boolean when updating the json value
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

function ValueEditor(props, context) {
  var _onChange = props.onChange;
  var fieldValue = props.fieldValue;
  var createDropdown = context.jsonEditor.createDropdown;

  var valueType = (0, _lib.getValueType)(fieldValue);

  if (valueType === 'boolean') {
    return React.createElement(
      'span',
      { className: 'bool-selector' },
      createDropdown(boolOptions, String(fieldValue), function (val) {
        return _onChange(convertToActualBool(val));
      }, {
        placeholder: 'Value'
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

ValueEditor.contextTypes = {
  jsonEditor: _react.PropTypes.object
};