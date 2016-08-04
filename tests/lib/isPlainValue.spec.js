import expect from 'expect';
import isPlainValue from 'lib/isPlainValue';

describe('isPlainValue', () => {
  it('returns true if the value is a plain value', () => {
    expect(isPlainValue(null)).toBe(true, 'null');
    expect(isPlainValue('string')).toBe(true, 'string');
    expect(isPlainValue(42)).toBe(true, 'number');
    expect(isPlainValue(false)).toBe(true, 'boolean');
  });

  it('returns false if the value is not a plain value', () => {
    expect(isPlainValue({})).toBe(false, 'map');
    expect(isPlainValue([])).toBe(false, 'array');
  });
});
