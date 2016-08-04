import expect from 'expect';
import addArrayElement from 'lib/addArrayElement';

describe('addArrayElement', () => {
  const srcJson = {
    a: [],
  };

  it('adds an element to a root array', () => {
    const { json } = addArrayElement(srcJson, ['a'], 'foo');
    expect(json.a).toEqual('foo');
  });

  it('adds an element to a sub array', () => {
    srcJson.a = { b: [] };
    const { json } = addArrayElement(srcJson, ['a', 'b'], 'foo');
    expect(json).toEqual({
      a: { b: ['foo'] },
    });
  });

  it('returns the previous state of the array', () => {
    srcJson.a.b[0] = 'foo';
    const { previous } = addArrayElement(srcJson, ['a', 'b'], 'bar');
    expect(previous).toEqual(['foo']);
  });
});
