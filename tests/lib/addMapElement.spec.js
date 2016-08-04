import expect from 'expect';
import addMapElement from 'lib/addMapElement';

describe('addMapElement', () => {
  describe('root json object', () => {
    const srcJson = {};

    it('adds an element to the root json object', () => {
      const { json } = addMapElement(srcJson, [], 'foo', 'bar');
      expect(json).toEqual({ foo: 'bar' });
    });

    it('returns the previous state of the root json object', () => {
      delete srcJson.foo;
      const { previous } = addMapElement(srcJson, [], 'foo', 'bar');
      expect(previous).toEqual({});
    });

    it('does not add an element if the key already exists', () => {
      srcJson.foo = 'bar';
      const { json, previous } = addMapElement(srcJson, [], 'foo', 'baz');
      expect(json).toNotExist();
      expect(previous).toNotExist();
    });

    it('does not modify the original json', () => {
      addMapElement(srcJson, [], 'bar', 'baz');
      expect(srcJson.bar).toBe(undefined);
    });
  });

  describe('child object', () => {
    const srcJson = {
      foo: { bar: {} },
    };

    it('adds an element to a map below the root object', () => {
      srcJson.foo = { bar: {} };
      const { json } = addMapElement(srcJson, ['foo', 'bar'], 'sub', 'baz');
      expect(json).toEqual({
        foo: {
          bar: {
            sub: 'baz',
          },
        },
      });
    });

    it('returns the previous state of the object', () => {
      const { previous } = addMapElement(srcJson, ['foo', 'bar'], 'sub', 'baz');
      expect(previous).toEqual({});
    });

    it('does not add an element if the key already exists', () => {
      const { json, previous } = addMapElement(srcJson, ['foo'], 'bar', 'baz');
      expect(json).toNotExist();
      expect(previous).toNotExist();
    });

    it('does not modify the original sub object', () => {
      addMapElement(srcJson, ['foo'], 'baz', 'baz');
      expect(srcJson.foo).toEqual({ bar: {} });
    });
  });
});
