import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';

export default function removeElement(json, path, isArrayElement) {
  const cloned = cloneDeep(json);

  if (path.length === 1) { // removing from the root json object
    const previous = cloneDeep(json[path[0]]);
    delete cloned[path[0]];

    return {
      json: cloned,
      previous,
    };
  } else { // removing from a sub object or array
    const beforePath = path.slice(0, path.length - 1);
    const elementKey = path[path.length - 1];
    const beforePathValue = get(cloned, beforePath);
    const clonedBeforePathValue = cloneDeep(beforePathValue);

    if (isArrayElement) {
      beforePathValue.splice(elementKey, 1);
    } else {
      delete beforePathValue[elementKey];
    }

    return {
      json: cloned,
      previous: clonedBeforePathValue,
    };
  }
}
