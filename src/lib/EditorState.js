import { fromJS, List, Iterable } from 'immutable';
import isPlainObject from 'lodash.isplainobject';

/**
 * Maintains the state of the JSON being edited
 * @param {string|object|array} the JSON to edit
 */
export default class EditorState {
  constructor(json) {
    this.state = fromJS(this.parseJson(json));
    this.dirty = false;
    this.undoStack = [];
    this.redoStack = [];
  }

  parseJson(json) {
    if (!json) return {};
    if (isPlainObject(json) || Array.isArray(json)) return json;
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  getJson() {
    return this.state.toJSON();
  }

  /**
   * Adds an element to a map field
   * @param {array} path the path at which the map exists
   * @param {string} key the key to add the element as
   * @param {any} value the value to assign to the key
   * @return {boolean|this} returns false if the key already exists, otherwise returns the updated editor state
   */
  addMapElement(path, key, value) {
    const keyPath = (path || []).concat(key);

    if (this.state.getIn(keyPath) !== undefined) {
      return false;
    }

    this.redoStack = [];
    this.undoStack.push(this.state);
    this.state = this.state.setIn(keyPath, value);
    this.dirty = true;
    return this;
  }

  /**
   * Adds an element to the end of an array field
   * @param {array} path the path at which the array exists
   * @param {any} value the value to assign to the new element
   * @return {this} the updated editor state
   */
  addArrayElement(path, value) {
    path = path || [];

    const currentValue = this.getValueAt(path);
    let index;

    if (List.isList(currentValue)) {
      index = currentValue.size;
    } else if (Array.isArray(currentValue)) {
      index = currentValue.length;
    } else {
      index = 0;
    }

    path = path.concat(index);

    this.redoStack = [];
    this.undoStack.push(this.state);
    this.state = this.state.setIn(path, value);
    this.dirty = true;
    return this;
  }

  /**
   * Returns the value at the given path
   * @param {array} path the path at which to get the value
   * @param {boolean} asJson return the raw json data instead of the immutable data
   * @return {any}
   */
  getValueAt(path, asJson) {
    path = path || [''];
    // return this.state.getIn(path);
    const value = this.state.getIn(path);

    if (Iterable.isIterable(value) && asJson) {
      return value.toJSON();
    }

    return value;
  }

  /**
   * Sets the value of the element at the given path
   * @param {array} path the path at which to set the value
   * @param {any} value the value to set. maps and arrays will be converted into immutable types
   * @return {this}
   */
  setFieldValue(path, value) {
    path = path || [];

    if (!path.length) path = [''];

    this.redoStack = [];
    this.undoStack.push(this.state);

    // must use fromJS here, so that setting values like [] or {} get translated to immutable types
    this.state = this.state.setIn(path, fromJS(value));

    this.dirty = true;
    return this;
  }

  /**
   * Removes the element at the given path
   * @param {array} path the path of the element to remove
   * @return {this}
   */
  removeElement(path) {
    path = path || [];

    if (!path.length) path = [''];

    this.redoStack = [];
    this.undoStack.push(this.state);
    this.state = this.state.removeIn(path);
    this.dirty = true;
    return this;
  }

  /**
   * Reverts the last change
   * @return {this}
   */
  undo() {
    const previous = this.undoStack.pop();

    if (previous) {
      this.redoStack.push(this.state);
      this.state = previous;
      this.dirty = true;
    }

    return this;
  }

  /**
   * Returns true if there are any changes that can be undone
   * @return {boolean}
   */
  canUndo() {
    return this.undoStack && this.undoStack.length > 0;
  }

  /**
   * Reverts the last undo
   * @return {this}
   */
  redo() {
    const next = this.redoStack.pop();

    if (next) {
      this.undoStack.push(this.state);
      this.state = next;
      this.dirty = true;
    }

    return this;
  }

  /**
   * Returns true if there are any undos that can be redone
   * @return {boolean}
   */
  canRedo() {
    return this.redoStack && this.redoStack.length > 0;
  }

  /**
   * Returns true if the state has been modified
   * @return {boolean}
   */
  isDirty() {
    return !!this.dirty;
  }

  /**
   * Marks the state as  modified
   * @return {this}
   */
  setDirty() {
    this.dirty = true;
    return this;
  }

  /**
   * Marks the state as not modified
   * @return {this}
   */
  setClean() {
    this.dirty = false;
    return this;
  }
}
