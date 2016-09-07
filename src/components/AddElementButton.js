import { Component, PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import { getValueType } from '../lib';

export default class AddElementButton extends Component {
  static propTypes = {
    fieldValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
      PropTypes.number,
      PropTypes.bool,
    ]),
    path: PropTypes.arrayOf(PropTypes.string),
  }

  static contextTypes = {
    jsonEditor: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      newElementName: '',
      newElementNameInvalid: false,
    };

    this.addElement = ::this.addElement;
  }

  addElement(e) {
    if (e) {
      e.preventDefault();
    }

    const { fieldValue, path } = this.props;
    const { newElementName } = this.state;
    const { addArrayElement, addMapElement } = this.context.jsonEditor;

    if (getValueType(fieldValue) === 'array') {
      return addArrayElement(path, null);
    }

    const added = addMapElement(path, newElementName, null);

    if (added) {
      this.newElementOverlay.hide();
      this.setState({
        newElementInvalidName: false,
      });
    } else {
      this.setState({
        newElementInvalidName: true,
      });
    }
  }

  render() {
    const { fieldValue } = this.props;
    const { newElementName, newElementInvalidName } = this.state;
    const isArray = getValueType(fieldValue) === 'array';
    const onBtnClick = isArray ? ::this.addElement : null;

    const button = (
      <button className="btn default btn-xs add-element-btn" type="button" onClick={onBtnClick}>
        <i className="fa fa-plus" />
        Add element
      </button>
    );

    // new array elements don't need a name, so just render the button and add the element when it's clicked
    if (isArray) {
      return button;
    }

    const newElementNameOverlay = (
      <Popover id="json-editor-new-element-name">
        <form onSubmit={this.addElement}>
          <input
            type="text"
            className="form-control"
            placeholder="Element Name"
            value={newElementName}
            onChange={e => this.setState({ newElementName: e.target.value })}
            ref={i => setTimeout(() => i && i.focus())}
          />

          <i className="fa fa-check add-new-element" onClick={this.addElement} />
          <i className="fa fa-times cancel-new-element" onClick={() => this.newElementOverlay.hide()} />

          { newElementInvalidName &&
            <div className="invalid-element-name"> Map element keys must be unique </div>
          }
        </form>
      </Popover>
    );

    return (
      <OverlayTrigger
        overlay={newElementNameOverlay}
        trigger={['click']}
        placement="top"
        rootClose={true}
        onEnter={() => this.setState({ newElementInvalidName: false })}
        onExited={() => this.setState({ newElementName: '' })}
        ref={ot => (this.newElementOverlay = ot)}
      >
        { button }
      </OverlayTrigger>
    );
  }
}
