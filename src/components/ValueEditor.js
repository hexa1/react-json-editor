import { PropTypes } from 'react';
import ReactSelect from 'react-select';

import { getValueType } from '../lib';

const boolOptions = [{
  value: 'true', label: 'True',
}, {
  value: 'false', label: 'False',
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

export default function ValueEditor(props) {
  const { onChange, fieldValue } = props;
  const valueType = getValueType(fieldValue);

  if (valueType === 'boolean') {
    return (
      <span className="bool-selector">
        <ReactSelect
          value={String(fieldValue)}
          options={boolOptions}
          clearable={false}
          searchable={false}
          onChange={val => onChange(convertToActualBool(val))}
        />
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
