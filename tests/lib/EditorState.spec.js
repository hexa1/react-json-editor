import expect from 'expect';
import immutable from 'immutable';
import EditorState from 'lib/EditorState';

describe('EditorState', () => {
  it('is a class', () => {
    expect(EditorState).toBeA(Function);
    expect(new EditorState()).toBeA(EditorState);
  });

  it('getJson', () => {
    const editor = new EditorState({ foo: 'bar' });
    expect(editor.getJson()).toEqual({ foo: 'bar' });
  });

  describe('addMapElement', () => {
    it('adds an element to the root json object', () => {
      const editor = new EditorState({});
      expect(editor.addMapElement([], 'foo', 'bar').getJson()).toEqual({ foo: 'bar' });
    });

    it('adds a child element', () => {
      const editor = new EditorState({ foo: {} });
      expect(editor.addMapElement(['foo'], 'bar', 'baz').getJson()).toEqual({ foo: { bar: 'baz' } });
    });

    it('does not add an element if the key already exists', () => {
      let editor = new EditorState({ foo: 'bar' });
      expect(editor.addMapElement([], 'foo', 'bar')).toEqual(false);

      editor = new EditorState({ foo: { bar: 'baz' } });
      expect(editor.addMapElement(['foo'], 'bar', 'baz')).toEqual(false);
    });

    // https://github.com/hexa1/react-json-editor/issues/3
    it('does not split a key with periods into a nested field', () => {
      let editor = new EditorState({});
      expect(editor.addMapElement([], 'foo.bar.baz', 'nested').getJson()).toEqual({ 'foo.bar.baz': 'nested' });

      editor = new EditorState({ foo: {} });
      expect(editor.addMapElement(['foo'], 'bar.baz', 'nested').getJson()).toEqual({ foo: { 'bar.baz': 'nested' } });
    });
  });

  describe('addArrayElement', () => {
    it('adds an element to a root array', () => {
      const editor = new EditorState([]);
      expect(editor.addArrayElement([], 'foo').getJson()).toEqual(['foo']);
    });

    it('adds an element to a child array', () => {
      let editor = new EditorState([0, [[]]]);
      expect(editor.addArrayElement([1, 0], 1).getJson()).toEqual([0, [[1]]]);

      editor = new EditorState([0, [{ foo: [] }]]);
      expect(
        editor.addArrayElement([1, 0, 'foo'], 'super nested').getJson()
      ).toEqual([0, [{ foo: ['super nested'] }]]);
    });
  });

  describe('getValueAt', () => {
    it('returns the immutable data if the value is an iterable and asJson = false', () => {
      const editor = new EditorState({ foo: { bar: 'baz' } });
      expect(
        immutable.fromJS({ bar: 'baz' }).equals(editor.getValueAt(['foo']))
      ).toBe(true);
    });

    it('returns the json data if asJson = true', () => {
      const editor = new EditorState({ foo: { bar: 'baz' } });
      expect(editor.getValueAt(['foo'], true)).toEqual({ bar: 'baz' });
    });
  });

  describe('setFieldValue', () => {
    it('sets the value of a root-level field', () => {
      const editor = new EditorState({ foo: 'bar' });
      expect(editor.setFieldValue(['foo'], 'baz').getJson()).toEqual({ foo: 'baz' });
    });

    it('sets the value of a nested field', () => {
      const editor = new EditorState({ foo: [{ bar: [{ baz: '' }] }] });
      expect(
        editor.setFieldValue(['foo', 0, 'bar', 0, 'baz'], 'super nested').getJson()
      ).toEqual({ foo: [{ bar: [{ baz: 'super nested' }] }] });
    });
  });

  describe('removeElement', () => {
    it('removes a root-level element', () => {
      let editor = new EditorState({ foo: 'bar' });
      expect(editor.removeElement(['foo']).getJson()).toEqual({});

      editor = new EditorState(['foo', 'bar']);
      expect(editor.removeElement([0]).getJson()).toEqual(['bar']);
    });

    it('removes a child element', () => {
      let editor = new EditorState({ foo: { bar: { baz: 'nested' } } });
      expect(editor.removeElement(['foo', 'bar', 'baz']).getJson()).toEqual({ foo: { bar: {} } });

      editor = new EditorState([0, [{ foo: [{ bar: 'baz' }] }]]);
      expect(editor.removeElement([1, 0, 'foo', 0]).getJson()).toEqual([0, [{ foo: [] }]]);
    });
  });

  describe('undo/redo', () => {
    it('undo', () => {
      const editor = new EditorState({ foo: 'original' });
      expect(editor.setFieldValue(['foo'], 'changed').undo().getJson()).toEqual({ foo: 'original' });
    });

    it('redo', () => {
      const editor = new EditorState({ foo: 'original' });
      expect(editor.setFieldValue(['foo'], 'changed').undo().redo().getJson()).toEqual({ foo: 'changed' });
    });
  });
});
