import expect from 'expect';
import changeFieldValue from 'lib/changeFieldValue';

describe('changeFieldValue', () => {
  const srcJson = {
    foo: 'bar',
  };

  it('performs a deep clone of the original json', () => {
    const { json } = changeFieldValue(srcJson, 'foo', 'bar');
    expect(json).toExist();
    expect(json).toNotBe(srcJson);
  });

  it('returns the previous value of the field', () => {
    const { previous } = changeFieldValue(srcJson, 'foo', 'baz');
    expect(previous).toEqual('bar');
  });

  it('changes the value of a root-level field', () => {
    const { json } = changeFieldValue(srcJson, 'foo', 'baz');
    expect(json.foo).toEqual('baz');
  });

  it('changes the value of a sub field', () => {
    srcJson.foo = [{
      bar: [{
        baz: 'baz',
      }],
    }];

    const { json, previous } = changeFieldValue(srcJson, ['foo', 0, 'bar'], true);
    expect(previous).toEqual(srcJson.foo[0].bar);
    expect(json).toEqual({
      foo: [{
        bar: true,
      }],
    });
  });
});
