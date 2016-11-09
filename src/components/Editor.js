import { Component, PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import { EditorState, getValueType } from '../lib';
import Field from './Field';
import AddElementButton from './AddElementButton';

export default class JSONEditor extends Component {
  static propTypes = {
    json: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array,
    ]),
    onChange: PropTypes.func,
    dropdownFactory: PropTypes.func,
    tooltipFactory: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
  }

  static childContextTypes = {
    jsonEditor: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      editorState: new EditorState(props.json),
    };

    this.onFieldValueChange = ::this.onFieldValueChange;
    this.addArrayElement = ::this.addArrayElement;
    this.addMapElement = ::this.addMapElement;
    this.removeElement = ::this.removeElement;
    this.createDropdown = ::this.createDropdown;
    this.createTooltip = ::this.createTooltip;
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
        createTooltip: this.createTooltip,
      },
    };
  }

  onFieldValueChange(path, value) {
    const { onChange } = this.props;
    const { editorState } = this.state;

    this.setState({
      editorState: editorState.setFieldValue(path, value),
    }, () => {
      if (onChange) {
        onChange(this.state.editorState.getJson());
      }
    });
  }

  addArrayElement(path, value) {
    const { onChange } = this.props;
    const { editorState } = this.state;

    this.setState({
      editorState: editorState.addArrayElement(path, value),
    }, () => {
      if (onChange) {
        onChange(this.state.editorState.getJson());
      }
    });
  }

  addMapElement(path, key, value) {
    const { onChange } = this.props;
    const { editorState } = this.state;

    const updatedState = editorState.addMapElement(path.concat(key), value);

    // addMapElement will return false if the key already exists
    if (!updatedState) return false;

    this.setState({
      editorState: updatedState,
    });

    if (onChange) {
      onChange(updatedState.getJson());
    }

    return true;
  }

  removeElement(path) {
    const { onChange } = this.props;
    const { editorState } = this.state;

    this.setState({
      editorState: editorState.removeElement(path),
    }, () => {
      if (onChange) {
        onChange(this.state.editorState.getJson());
      }
    });
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

  createTooltip(tooltipText, triggerComponent, placement = 'left', id) {
    const { tooltipFactory } = this.props;

    if (tooltipFactory) {
      return tooltipFactory(tooltipText, triggerComponent, placement, id);
    } else {
      const tooltip = <Tooltip id={id}>{ tooltipText }</Tooltip>;
      return (
        <OverlayTrigger overlay={tooltip} placement={placement}>
          { triggerComponent }
        </OverlayTrigger>
      );
    }
  }

  undo() {
    this.setState({
      editorState: this.state.editorState.undo(),
    });
  }

  redo() {
    this.setState({
      editorState: this.state.editorState.redo(),
    });
  }

  render() {
    const { editorState } = this.state;
    const json = editorState.getJson();

    return (
      <div className="json-editor">
        { Object.keys(json).map(key => {
          if (typeof json[key] === 'undefined') {
            return null;
          }

          return (
            <Field
              key={key}
              fieldKey={key}
              fieldValue={json[key]}
              isArrayElement={getValueType(json) === 'array'}
            />
          );
        })}

        <div className="editor-actions">
          <AddElementButton path={[]} fieldValue={json} />

          { editorState.canUndo() &&
            <button className="btn default btn-xs" type="button" onClick={this.undo}>
              <i className="fa fa-undo" />
              Undo
            </button>
          }

          { editorState.canRedo() &&
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
