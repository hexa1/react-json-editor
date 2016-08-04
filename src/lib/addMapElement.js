import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';

import changeFieldValue from './changeFieldValue';

export default function addMapElement(json, path, name, value) {
  if (path && path.length) { // adding element to sub map - not root json object
    const cloned = cloneDeep(json);
    const previous = get(cloned, path);

    if (typeof previous[name] !== 'undefined') {
      return false;
    }

    // get a snapshot of the previous value before we modify it
    const clonedPrevious = cloneDeep(previous);

    previous[name] = value;

    return {
      json: changeFieldValue(json, path, previous).json,
      previous: clonedPrevious,
    };
  } else { // adding element to root json object
    if (typeof json[name] !== 'undefined') {
      return false;
    }

    return {
      json: changeFieldValue(json, name, value).json,
      previous: json,
    };
  }
}
