import isPlainValue from './isPlainValue';

/**
 * Given a current value, return a new value for the specified type
 * @param  {Any} value       Current value
 * @param  {String} nextType    The new type to return
 * @return {Any}             The new value
 */
export default function coerceToType(value, nextType) {
  switch (nextType) {
    case 'string':
      if (isPlainValue(value)) {
        return String(value);
      }

      return '';

    case 'boolean':
      return typeof value === 'boolean' ? value : true;

    case 'map':
      return {};

    case 'array':
      return [value];

    case 'number':
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
      }

      return 0;

    default:
      return null;
  }
}
