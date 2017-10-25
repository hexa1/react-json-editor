'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ValueEditor;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boolOptions = [{
  value: 'true', label: 'True'
}, {
  value: 'false', label: 'False'
}];

// values in the bool options are strings for ease of use across dropdown components
// convert the value back to an actual boolean when updating the json value
function convertToActualBool(string) {
  return string === 'true' || string === true;
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
  var _onChange = props.onChange,
      fieldValue = props.fieldValue;
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

ValueEditor.propTypes = {
  fieldValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.number, _propTypes2.default.bool]),
  onChange: _propTypes2.default.func
};

ValueEditor.contextTypes = {
  jsonEditor: _propTypes2.default.object
};