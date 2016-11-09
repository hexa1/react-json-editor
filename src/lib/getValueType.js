import isPlainObject from 'lodash.isplainobject';

export default function getValueType(value) {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  if (isPlainObject(value)) {
    return 'map';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return typeof value;
  }

  if (typeof value !== 'undefined' && typeof value.length !== 'undefined') {
    return 'array';
  }

  return 'string';
}
