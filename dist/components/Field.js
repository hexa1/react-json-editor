'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');

var _OverlayTrigger2 = _interopRequireDefault(_OverlayTrigger);

var _Tooltip = require('react-bootstrap/lib/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _lib = require('../lib');

var _ValueEditor = require('./ValueEditor');

var _ValueEditor2 = _interopRequireDefault(_ValueEditor);

var _AddElementButton = require('./AddElementButton');

var _AddElementButton2 = _interopRequireDefault(_AddElementButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var typeSelectorOptions = [{
  label: 'String', value: 'string'
}, {
  label: 'Number', value: 'number'
}, {
  label: 'Boolean', value: 'boolean'
}, {
  label: 'Array', value: 'array'
}, {
  label: 'Map', value: 'map'
}];

var JSONField = function (_Component) {
  _inherits(JSONField, _Component);

  function JSONField(props) {
    _classCallCheck(this, JSONField);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JSONField).call(this, props));

    _this.state = {
      expanded: true
    };

    _this.toggleExpanded = _this.toggleExpanded.bind(_this);
    _this.onValueChange = _this.onValueChange.bind(_this);
    _this.onTypeChange = _this.onTypeChange.bind(_this);
    _this.nullifyValue = _this.nullifyValue.bind(_this);
    _this.removeElement = _this.removeElement.bind(_this);
    return _this;
  }

  _createClass(JSONField, [{
    key: 'toggleExpanded',
    value: function toggleExpanded() {
      this.setState({ expanded: !this.state.expanded });
    }

    // this will only be called for plain types - strings, numbers, booleans

  }, {
    key: 'onValueChange',
    value: function onValueChange(value) {
      var fieldValue = this.props.fieldValue;
      var onFieldValueChange = this.context.jsonEditor.onFieldValueChange;

      var valueType = (0, _lib.getValueType)(fieldValue);

      onFieldValueChange(this.getFieldPath(), (0, _lib.coerceToType)(value, valueType));
    }
  }, {
    key: 'onTypeChange',
    value: function onTypeChange(nextType) {
      var fieldValue = this.props.fieldValue;
      var onFieldValueChange = this.context.jsonEditor.onFieldValueChange;


      onFieldValueChange(this.getFieldPath(), (0, _lib.coerceToType)(fieldValue, nextType));
    }
  }, {
    key: 'nullifyValue',
    value: function nullifyValue() {
      var onFieldValueChange = this.context.jsonEditor.onFieldValueChange;

      onFieldValueChange(this.getFieldPath(), null);
    }
  }, {
    key: 'removeElement',
    value: function removeElement() {
      var removeElement = this.context.jsonEditor.removeElement;

      var path = this.getFieldPath();
      removeElement(path);
    }
  }, {
    key: 'getFieldPath',
    value: function getFieldPath() {
      var _props = this.props;
      var path = _props.path;
      var fieldKey = _props.fieldKey;
      var isArrayElement = _props.isArrayElement;

      // if we're in an array, path should look like `some.path.to[index]`
      // see https://lodash.com/docs#set

      if (isArrayElement) {
        return path.join('.').concat('[' + fieldKey + ']');
      }

      return path.concat(fieldKey).join('.');
    }
  }, {
    key: 'renderValue',
    value: function renderValue() {
      var _props2 = this.props;
      var fieldKey = _props2.fieldKey;
      var fieldValue = _props2.fieldValue;
      var path = _props2.path;
      var expanded = this.state.expanded;

      var isArray = (0, _lib.getValueType)(fieldValue) === 'array';

      if (fieldValue === null) {
        return React.createElement(
          'span',
          { className: 'null-value' },
          '[null]'
        );
      }

      // strings, numbers, and bools
      if ((0, _lib.isPlainValue)(fieldValue)) {
        return React.createElement(_ValueEditor2.default, { fieldValue: fieldValue, onChange: this.onValueChange });
      }

      // maps and arrays
      if (expanded) {
        return React.createElement(
          'div',
          { className: 'indented' },
          Object.keys(fieldValue).map(function (key, idx) {
            if (typeof fieldValue[key] === 'undefined') {
              return null;
            }

            return React.createElement(JSONField, {
              key: key,
              fieldKey: key,
              fieldValue: fieldValue[key],
              path: path.concat(fieldKey),
              isArrayElement: isArray
            });
          }),
          React.createElement(_AddElementButton2.default, { fieldValue: fieldValue, path: this.getFieldPath() })
        );
      }
    }
  }, {
    key: 'renderTypeSelectorAndButtons',
    value: function renderTypeSelectorAndButtons() {
      var fieldValue = this.props.fieldValue;


      return React.createElement(
        'span',
        null,
        React.createElement(_reactSelect2.default, {
          options: typeSelectorOptions,
          clearable: false,
          searchable: false,
          value: (0, _lib.getValueType)(fieldValue),
          placeholder: 'Type',
          onChange: this.onTypeChange
        }),
        fieldValue !== null && React.createElement(
          _OverlayTrigger2.default,
          { overlay: React.createElement(
              _Tooltip2.default,
              { id: 'nullify' },
              'Make null'
            ), placement: 'left' },
          React.createElement('i', { className: 'fa fa-eraser nullify-btn', onClick: this.nullifyValue })
        ),
        React.createElement(
          _OverlayTrigger2.default,
          { overlay: React.createElement(
              _Tooltip2.default,
              { id: 'remove' },
              'Remove field'
            ), placement: 'left' },
          React.createElement('i', { className: 'fa fa-times remove-btn', onClick: this.removeElement })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var fieldKey = _props3.fieldKey;
      var fieldValue = _props3.fieldValue;
      var expanded = this.state.expanded;

      var valueIsPlain = (0, _lib.isPlainValue)(fieldValue);

      var expandIconClassname = (0, _classnames2.default)('fa expander-icon', {
        'fa-minus-square-o': expanded,
        'fa-plus-square-o': !expanded
      });

      var fieldClassname = (0, _classnames2.default)('json-field', {
        'non-expandable': valueIsPlain
      });

      return React.createElement(
        'div',
        { className: fieldClassname },
        !valueIsPlain && React.createElement('i', { className: expandIconClassname, onClick: this.toggleExpanded }),
        React.createElement(
          'strong',
          { className: 'field-key' },
          fieldKey,
          ': '
        ),
        !valueIsPlain && this.renderTypeSelectorAndButtons(),
        this.renderValue(),
        valueIsPlain && this.renderTypeSelectorAndButtons()
      );
    }
  }]);

  return JSONField;
}(_react.Component);

JSONField.propTypes = {
  fieldKey: _react.PropTypes.string,
  fieldValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array, _react.PropTypes.object, _react.PropTypes.number, _react.PropTypes.bool]),
  path: _react.PropTypes.arrayOf(_react.PropTypes.string),
  isArrayElement: _react.PropTypes.bool
};
JSONField.defaultProps = {
  path: []
};
JSONField.contextTypes = {
  jsonEditor: _react.PropTypes.object
};
exports.default = JSONField;