import expect from 'expect';
import removeElement from 'lib/removeElement';

describe('removeElement', () => {
  describe('from a map', () => {
    const srcJson = { foo: { bar: 'baz' } };

    it('removes an element from the root json object and returns the previous state', () => {
      const { json, previous } = removeElement(srcJson, ['foo']);
      expect(json).toEqual({});
      expect(previous).toEqual({ bar: 'baz' });
    });

    it('removes an element from a child object and returns the previous state', () => {
      const { json, previous } = removeElement(srcJson, ['foo', 'bar']);
      expect(json).toEqual({ foo: {} });
      expect(previous).toEqual({ bar: 'baz' });
    });
  });

  describe('from an array', () => {
    const srcJson = { foo: ['a', 'b', 'c'] };

    it('removes an element and returns the previous state', () => {
      const { json, previous } = removeElement(srcJson, ['foo', 1], true);
      expect(json).toEqual({ foo: ['a', 'c'] });
      expect(previous).toEqual(['a', 'b', 'c']);
    });
  });
});
