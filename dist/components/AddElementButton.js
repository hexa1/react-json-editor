'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');

var _OverlayTrigger2 = _interopRequireDefault(_OverlayTrigger);

var _Popover = require('react-bootstrap/lib/Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddElementButton = function (_Component) {
  _inherits(AddElementButton, _Component);

  function AddElementButton(props) {
    _classCallCheck(this, AddElementButton);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AddElementButton).call(this, props));

    _this.state = {
      newElementName: '',
      newElementNameInvalid: false
    };

    _this.addElement = _this.addElement.bind(_this);
    return _this;
  }

  _createClass(AddElementButton, [{
    key: 'addElement',
    value: function addElement(e) {
      if (e) {
        e.preventDefault();
      }

      var _props = this.props;
      var fieldValue = _props.fieldValue;
      var path = _props.path;
      var newElementName = this.state.newElementName;
      var _context$jsonEditor = this.context.jsonEditor;
      var addArrayElement = _context$jsonEditor.addArrayElement;
      var addMapElement = _context$jsonEditor.addMapElement;


      if ((0, _lib.getValueType)(fieldValue) === 'array') {
        return addArrayElement(path, null);
      }

      var added = addMapElement(path, newElementName, null);

      if (added) {
        this.newElementOverlay.hide();
        this.setState({
          newElementInvalidName: false
        });
      } else {
        this.setState({
          newElementInvalidName: true
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var fieldValue = this.props.fieldValue;
      var _state = this.state;
      var newElementName = _state.newElementName;
      var newElementInvalidName = _state.newElementInvalidName;

      var isArray = (0, _lib.getValueType)(fieldValue) === 'array';
      var onBtnClick = isArray ? this.addElement.bind(this) : null;

      var button = React.createElement(
        'button',
        { className: 'btn default btn-xs add-element-btn', type: 'button', onClick: onBtnClick },
        React.createElement('i', { className: 'fa fa-plus' }),
        'Add element'
      );

      // new array elements don't need a name, so just render the button and add the element when it's clicked
      if (isArray) {
        return button;
      }

      var newElementNameOverlay = React.createElement(
        _Popover2.default,
        { id: 'json-editor-new-element-name' },
        React.createElement(
          'form',
          { onSubmit: this.addElement },
          React.createElement('input', {
            type: 'text',
            className: 'form-control',
            placeholder: 'Element Name',
            value: newElementName,
            onChange: function onChange(e) {
              return _this2.setState({ newElementName: e.target.value });
            },
            ref: function ref(i) {
              return setTimeout(function () {
                return i && i.focus();
              });
            }
          }),
          React.createElement('i', { className: 'fa fa-check add-new-element', onClick: this.addElement }),
          React.createElement('i', { className: 'fa fa-times cancel-new-element', onClick: function onClick() {
              return _this2.newElementOverlay.hide();
            } }),
          newElementInvalidName && React.createElement(
            'div',
            { className: 'invalid-element-name' },
            ' Map element keys must be unique '
          )
        )
      );

      return React.createElement(
        _OverlayTrigger2.default,
        {
          overlay: newElementNameOverlay,
          trigger: ['click'],
          placement: 'top',
          rootClose: true,
          onEnter: function onEnter() {
            return _this2.setState({ newElementInvalidName: false });
          },
          onExited: function onExited() {
            return _this2.setState({ newElementName: '' });
          },
          ref: function ref(ot) {
            return _this2.newElementOverlay = ot;
          }
        },
        button
      );
    }
  }]);

  return AddElementButton;
}(_react.Component);

AddElementButton.propTypes = {
  fieldValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array, _react.PropTypes.object, _react.PropTypes.number, _react.PropTypes.bool]),
  path: _react.PropTypes.string
};
AddElementButton.contextTypes = {
  jsonEditor: _react.PropTypes.object
};
exports.default = AddElementButton;