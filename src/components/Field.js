import { Component, PropTypes } from 'react';
import cn from 'classnames';

import { isPlainValue, getValueType, coerceToType } from '../lib';
import ValueEditor from './ValueEditor';
import AddElementButton from './AddElementButton';

const typeSelectorOptions = [{
  label: 'String', value: 'string',
}, {
  label: 'Number', value: 'number',
}, {
  label: 'Boolean', value: 'boolean',
}, {
  label: 'Array', value: 'array',
}, {
  label: 'Map', value: 'map',
}];

export default class JSONField extends Component {
  static propTypes = {
    fieldKey: PropTypes.string,
    fieldValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
      PropTypes.number,
      PropTypes.bool,
    ]),
    path: PropTypes.arrayOf(PropTypes.string),
    isArrayElement: PropTypes.bool,
  }

  static defaultProps = {
    path: [],
  }

  static contextTypes = {
    jsonEditor: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      expanded: true,
    };

    this.toggleExpanded = ::this.toggleExpanded;
    this.onValueChange = ::this.onValueChange;
    this.onTypeChange = ::this.onTypeChange;
    this.nullifyValue = ::this.nullifyValue;
    this.removeElement = ::this.removeElement;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.expanded !== this.state.expanded) {
      return true;
    }

    if (JSON.stringify(nextProps.fieldValue) !== JSON.stringify(this.props.fieldValue)) {
      return true;
    }

    return false;
  }

  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  // this will only be called for plain types - strings, numbers, booleans
  onValueChange(value) {
    const { fieldValue } = this.props;
    const { onFieldValueChange } = this.context.jsonEditor;
    const valueType = getValueType(fieldValue);

    onFieldValueChange(this.getFieldPath(), coerceToType(value, valueType));
  }

  onTypeChange(nextType) {
    const { fieldValue } = this.props;
    const { onFieldValueChange } = this.context.jsonEditor;

    onFieldValueChange(this.getFieldPath(), coerceToType(fieldValue, nextType));
  }

  nullifyValue() {
    const { onFieldValueChange } = this.context.jsonEditor;
    onFieldValueChange(this.getFieldPath(), null);
  }

  removeElement() {
    const { removeElement } = this.context.jsonEditor;
    const path = this.getFieldPath();

    removeElement(path);
  }

  getFieldPath() {
    const { path, fieldKey, isArrayElement } = this.props;
    return path.concat(isArrayElement ? parseInt(fieldKey, 10) : fieldKey);
  }

  renderValue() {
    const { fieldKey, fieldValue, path } = this.props;
    const { expanded } = this.state;
    const isArray = getValueType(fieldValue) === 'array';

    if (fieldValue === null) {
      return <span className="null-value">[null]</span>;
    }

    // strings, numbers, and bools
    if (isPlainValue(fieldValue)) {
      return <ValueEditor fieldValue={fieldValue} onChange={this.onValueChange} />;
    }

    // maps and arrays
    if (expanded) {
      return (
        <div className="indented">
          { Object.keys(fieldValue).map((key, idx) => {
            if (typeof fieldValue[key] === 'undefined') {
              return null;
            }

            return (
              <JSONField
                key={key}
                fieldKey={key}
                fieldValue={fieldValue[key]}
                path={path.concat(fieldKey)}
                isArrayElement={isArray}
              />
            );
          })}

          <AddElementButton fieldValue={fieldValue} path={this.getFieldPath()} />
        </div>
      );
    }
  }

  renderTypeSelectorAndButtons() {
    const { fieldValue } = this.props;
    const { createDropdown } = this.context.jsonEditor;

    return (
      <span>
        { createDropdown(typeSelectorOptions, getValueType(fieldValue), this.onTypeChange, {
          placeholder: 'Type',
        })}

        { this.renderButtons() }
      </span>
    );
  }

  renderButtons() {
    const { fieldValue } = this.props;
    const { createTooltip } = this.context.jsonEditor;

    const nullifyBtn = <i className="fa fa-eraser nullify-btn" onClick={this.nullifyValue} />;
    const nullifyTooltip = createTooltip('Make null', nullifyBtn, 'left', 'nullify');

    const removeBtn = <i className="fa fa-times remove-btn" onClick={this.removeElement} />;
    const removeTooltip = createTooltip('Remove field', removeBtn, 'left', 'remove');

    return (
      <span>
        { fieldValue !== null && (nullifyTooltip || nullifyBtn) }
        { removeTooltip || removeBtn }
      </span>
    );
  }

  render() {
    const { fieldKey, fieldValue, isArrayElement } = this.props;
    const { expanded } = this.state;
    const valueIsPlain = isPlainValue(fieldValue);

    const expandIconClassname = cn('fa expander-icon', {
      'fa-minus-square-o': expanded,
      'fa-plus-square-o': !expanded,
    });

    const fieldClassname = cn('json-field', {
      'non-expandable': valueIsPlain,
    });

    let fieldKeyLabel = fieldKey;
    if (isArrayElement) {
      fieldKeyLabel = `[${fieldKeyLabel}]`;
    }

    return (
      <div className={fieldClassname}>
        { !valueIsPlain && <i className={expandIconClassname} onClick={this.toggleExpanded} /> }

        <strong className="field-key">{ fieldKeyLabel }: </strong>

        { !valueIsPlain && this.renderTypeSelectorAndButtons() }
        { this.renderValue() }
        { valueIsPlain && this.renderTypeSelectorAndButtons() }
      </div>
    );
  }
}
