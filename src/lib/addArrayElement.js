import get from 'lodash.get';

import changeFieldValue from './changeFieldValue';

export default function addArrayElement(json, path, value) {
  const previous = get(json, path);

  return {
    json: changeFieldValue(json, path, previous.concat(value)).json,
    previous,
  };
}
