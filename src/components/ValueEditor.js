import { PropTypes } from 'react';

import { getValueType } from '../lib';

const boolOptions = [{
  value: 'true', label: 'True',
}, {
  value: 'false', label: 'False',
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

export default function ValueEditor(props, context) {
  const { onChange, fieldValue } = props;
  const { createDropdown } = context.jsonEditor;
  const valueType = getValueType(fieldValue);

  if (valueType === 'boolean') {
    return (
      <span className="bool-selector">
        { createDropdown(boolOptions, String(fieldValue), val => onChange(convertToActualBool(val)), {
          placeholder: 'Value',
        })}
      </span>
    );
  }

  return (
    <input
      type="text"
      className="form-control"
      value={fieldValue}
      onChange={e => onChange(e.target.value)}
      onKeyPress={evt => validateKeyPress(evt, fieldValue, valueType)}
    />
  );
}

ValueEditor.propTypes = {
  fieldValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
};

ValueEditor.contextTypes = {
  jsonEditor: PropTypes.object,
};
