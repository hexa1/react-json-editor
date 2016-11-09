'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maintains the state of the JSON being edited
 * @param {string|object|array} the JSON to edit
 */
var EditorState = function () {
  function EditorState(json) {
    _classCallCheck(this, EditorState);

    this.state = (0, _immutable.fromJS)(this.parseJson(json));
    this.dirty = false;
    this.undoStack = [];
    this.redoStack = [];
  }

  _createClass(EditorState, [{
    key: 'parseJson',
    value: function parseJson(json) {
      if (!json) return {};
      if ((0, _lodash2.default)(json) || Array.isArray(json)) return json;
      try {
        return JSON.parse(json);
      } catch (e) {
        return {};
      }
    }
  }, {
    key: 'getJson',
    value: function getJson() {
      return this.state.toJSON();
    }

    /**
     * Adds an element to a map field
     * @param {array} path the path at which the map exists
     * @param {string} key the key to add the element as
     * @param {any} value the value to assign to the key
     * @return {boolean|this} returns false if the key already exists, otherwise returns the updated editor state
     */

  }, {
    key: 'addMapElement',
    value: function addMapElement(path, key, value) {
      var keyPath = (path || []).concat(key);

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

  }, {
    key: 'addArrayElement',
    value: function addArrayElement(path, value) {
      path = path || [];

      var currentValue = this.getValueAt(path);
      var index = void 0;

      if (_immutable.List.isList(currentValue)) {
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

  }, {
    key: 'getValueAt',
    value: function getValueAt(path, asJson) {
      path = path || [''];
      // return this.state.getIn(path);
      var value = this.state.getIn(path);

      if (_immutable.Iterable.isIterable(value) && asJson) {
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

  }, {
    key: 'setFieldValue',
    value: function setFieldValue(path, value) {
      path = path || [];

      if (!path.length) path = [''];

      this.redoStack = [];
      this.undoStack.push(this.state);

      // must use fromJS here, so that setting values like [] or {} get translated to immutable types
      this.state = this.state.setIn(path, (0, _immutable.fromJS)(value));

      this.dirty = true;
      return this;
    }

    /**
     * Removes the element at the given path
     * @param {array} path the path of the element to remove
     * @return {this}
     */

  }, {
    key: 'removeElement',
    value: function removeElement(path) {
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

  }, {
    key: 'undo',
    value: function undo() {
      var previous = this.undoStack.pop();

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

  }, {
    key: 'canUndo',
    value: function canUndo() {
      return this.undoStack && this.undoStack.length > 0;
    }

    /**
     * Reverts the last undo
     * @return {this}
     */

  }, {
    key: 'redo',
    value: function redo() {
      var next = this.redoStack.pop();

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

  }, {
    key: 'canRedo',
    value: function canRedo() {
      return this.redoStack && this.redoStack.length > 0;
    }

    /**
     * Returns true if the state has been modified
     * @return {boolean}
     */

  }, {
    key: 'isDirty',
    value: function isDirty() {
      return !!this.dirty;
    }

    /**
     * Marks the state as  modified
     * @return {this}
     */

  }, {
    key: 'setDirty',
    value: function setDirty() {
      this.dirty = true;
      return this;
    }

    /**
     * Marks the state as not modified
     * @return {this}
     */

  }, {
    key: 'setClean',
    value: function setClean() {
      this.dirty = false;
      return this;
    }
  }]);

  return EditorState;
}();

exports.default = EditorState;