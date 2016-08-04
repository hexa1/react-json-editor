import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import get from 'lodash.get';

export default function changeFieldValue(json, path, value) {
  const previous = get(json, path);
  const cloned = cloneDeep(json);

  set(cloned, path, value);

  return {
    previous,
    json: cloned,
  };
}
