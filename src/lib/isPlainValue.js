export default function isPlainValue(value) {
  if (value === null) {
    return true;
  }

  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return true;
    default:
      return false;
  }
}
