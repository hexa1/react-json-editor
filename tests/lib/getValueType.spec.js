import expect from 'expect';
import getValueType from 'lib/getValueType';

describe('getValueType', () => {
  it('properly returns the value type', () => {
    expect(getValueType(null)).toBe(null);
    expect(getValueType({})).toBe('map');
    expect(getValueType('string')).toBe('string');
    expect(getValueType(42)).toBe('number');
    expect(getValueType(false)).toBe('boolean');
    expect(getValueType([])).toBe('array');
    expect(getValueType()).toBe('string');
  });
});
