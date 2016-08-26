import expect from 'expect';
import coerceToType from 'lib/coerceToType';

const values = ['', 42, true, null, {}, [], undefined];

describe('coerceToType', () => {
  it('coerces to string', () => {
    expect(coerceToType('foo', 'string')).toEqual('foo');
    expect(coerceToType(42, 'string')).toEqual('42');
    expect(coerceToType(true, 'string')).toEqual('true');
    expect(coerceToType(null, 'string')).toEqual('null');
    expect(coerceToType({}, 'string')).toEqual('');
    expect(coerceToType([], 'string')).toEqual('');
    expect(coerceToType(undefined, 'string')).toEqual('');
  });

  it('coerces to boolean', () => {
    values.map(value => expect(coerceToType(value, 'boolean')).toEqual(true));
  });

  it('coerces to map', () => {
    values.map(value => expect(coerceToType(value, 'map')).toEqual({}));
  });

  it('coerces to array', () => {
    values.map(value => expect(coerceToType(value, 'array')).toEqual([value]));
  });

  it('coerces to number', () => {
    expect(coerceToType('', 'number')).toEqual(0);
    expect(coerceToType('42', 'number')).toEqual(42);
    expect(coerceToType('a42', 'number')).toEqual(0);
    expect(coerceToType(42, 'number')).toEqual(42);
    expect(coerceToType(42.042, 'number')).toEqual(42.042);
    expect(coerceToType(0.042, 'number')).toEqual(0.042);
    expect(coerceToType(true, 'number')).toEqual(0);
    expect(coerceToType(null, 'number')).toEqual(0);
    expect(coerceToType({}, 'number')).toEqual(0);
    expect(coerceToType([], 'number')).toEqual(0);
    expect(coerceToType(undefined, 'number')).toEqual(0);
  });

  it('returns null if nextType is unknown', () => {
    expect(coerceToType(42, 'foo')).toBe(null);
  });

  it('when coercing a boolean to boolean, returns the same value', () => {
    expect(coerceToType(true, 'boolean')).toEqual(true);
    expect(coerceToType(false, 'boolean')).toEqual(false);
  });
});
