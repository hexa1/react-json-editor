import { Component, PropTypes } from 'react';
import isPlainObject from 'lodash.isplainobject';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import unset from 'lodash.unset';

import Field from './Field';
import AddElementButton from './AddElementButton';

export default class JSONEditor extends Component {
  static propTypes = {
    json: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    onChange: PropTypes.func,
    dropdownFactory: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
  }

  static childContextTypes = {
    jsonEditor: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.undoStack = [];
    this.redoStack = [];

    this.onFieldValueChange = ::this.onFieldValueChange;
    this.addArrayElement = ::this.addArrayElement;
    this.addMapElement = ::this.addMapElement;
    this.removeElement = ::this.removeElement;
    this.createDropdown = ::this.createDropdown;
    this.undo = ::this.undo;
    this.redo = ::this.redo;
  }

  getChildContext() {
    return {
      jsonEditor: {
        onFieldValueChange: this.onFieldValueChange,
        addArrayElement: this.addArrayElement,
        addMapElement: this.addMapElement,
        removeElement: this.removeElement,
        createDropdown: this.createDropdown,
      },
    };
  }

  parseJson() {
    const { json } = this.props;

    if (!json) {
      return {};
    }

    if (isPlainObject(json)) {
      return json;
    }

    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  onFieldValueChange(path, value) {
    const json = cloneDeep(this.parseJson());

    this.undoStack.push({
      path,
      value: get(json, path),
    });

    set(json, path, value);
    this.redoStack = [];
    this.props.onChange(json);
  }

  addArrayElement(path, value) {
    const json = cloneDeep(this.parseJson());
    const currentVal = get(json, path);

    this.undoStack.push({
      path,
      value: currentVal,
    });

    set(json, path, currentVal.concat(value));
    this.redoStack = [];
    this.props.onChange(json);
  }

  addMapElement(path, name, value) {
    const json = cloneDeep(this.parseJson());
    const currentVal = get(json, path) || json;

    if (typeof currentVal[name] !== 'undefined') {
      return false;
    }

    // quick hack to fix an issue where adding an element to the root level
    // messes up undo/redo since there's no path
    if (path) {
      this.undoStack.push({
        path,
        value: cloneDeep(currentVal),
      });
    }

    currentVal[name] = value;
    this.redoStack = [];
    this.props.onChange(json);

    return true;
  }

  removeElement(path) {
    const json = cloneDeep(this.parseJson());

    this.undoStack.push({
      path,
      value: get(json, path),
    });

    unset(json, path);
    this.redoStack = [];
    this.props.onChange(json);
  }

  createDropdown(options = [], value, onChange, props = {}) {
    const { dropdownFactory } = this.props;

    if (dropdownFactory && typeof dropdownFactory === 'function') {
      return dropdownFactory(options, value, onChange, props);
    }

    return (
      <select value={value} onChange={evt => onChange(evt.target.value)} defaultValue="" {...props}>
        <option disabled={true} value="">{ props.placeholder }</option>
        { options.map((opt, idx) =>
          <option value={opt.value} key={idx}>{ opt.label }</option>
        )}
      </select>
    );
  }

  undo() {
    const lastAction = this.undoStack.pop();
    const json = cloneDeep(this.parseJson());

    this.redoStack.push({
      path: lastAction.path,
      value: get(json, lastAction.path),
    });

    set(json, lastAction.path, lastAction.value);
    this.props.onChange(json);
  }

  redo() {
    const lastAction = this.redoStack.pop();
    const json = cloneDeep(this.parseJson());

    this.undoStack.push({
      path: lastAction.path,
      value: get(json, lastAction.path),
    });

    set(json, lastAction.path, lastAction.value);
    this.props.onChange(json);
  }

  render() {
    const json = this.parseJson();

    return (
      <div className="json-editor">
        { Object.keys(json).map(key => {
          if (typeof json[key] === 'undefined') {
            return null;
          }

          return <Field key={key} fieldKey={key} fieldValue={json[key]} />;
        })}

        <div className="editor-actions">
          <AddElementButton path="" />

          { this.undoStack.length > 0 &&
            <button className="btn default btn-xs" type="button" onClick={this.undo}>
              <i className="fa fa-undo" />
              Undo
            </button>
          }

          { this.redoStack.length > 0 &&
            <button className="btn default btn-xs" type="button" onClick={this.redo}>
              <i className="fa fa-repeat" />
              Redo
            </button>
          }
        </div>
      </div>
    );
  }
}
