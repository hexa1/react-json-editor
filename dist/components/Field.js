'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

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

    var _this = _possibleConstructorReturn(this, (JSONField.__proto__ || Object.getPrototypeOf(JSONField)).call(this, props));

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
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextState.expanded !== this.state.expanded) {
        return true;
      }

      if (JSON.stringify(nextProps.fieldValue) !== JSON.stringify(this.props.fieldValue)) {
        return true;
      }

      return false;
    }
  }, {
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
      var _props = this.props,
          path = _props.path,
          fieldKey = _props.fieldKey,
          isArrayElement = _props.isArrayElement;

      return path.concat(isArrayElement ? parseInt(fieldKey, 10) : fieldKey);
    }
  }, {
    key: 'renderValue',
    value: function renderValue() {
      var _props2 = this.props,
          fieldKey = _props2.fieldKey,
          fieldValue = _props2.fieldValue,
          path = _props2.path;
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
      var createDropdown = this.context.jsonEditor.createDropdown;


      return React.createElement(
        'span',
        null,
        createDropdown(typeSelectorOptions, (0, _lib.getValueType)(fieldValue), this.onTypeChange, {
          placeholder: 'Type'
        }),
        this.renderButtons()
      );
    }
  }, {
    key: 'renderButtons',
    value: function renderButtons() {
      var fieldValue = this.props.fieldValue;
      var createTooltip = this.context.jsonEditor.createTooltip;


      var nullifyBtn = React.createElement('i', { className: 'fa fa-eraser nullify-btn', onClick: this.nullifyValue });
      var nullifyTooltip = createTooltip('Make null', nullifyBtn, 'left', 'nullify');

      var removeBtn = React.createElement('i', { className: 'fa fa-times remove-btn', onClick: this.removeElement });
      var removeTooltip = createTooltip('Remove field', removeBtn, 'left', 'remove');

      return React.createElement(
        'span',
        null,
        fieldValue !== null && (nullifyTooltip || nullifyBtn),
        removeTooltip || removeBtn
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          fieldKey = _props3.fieldKey,
          fieldValue = _props3.fieldValue,
          isArrayElement = _props3.isArrayElement;
      var expanded = this.state.expanded;

      var valueIsPlain = (0, _lib.isPlainValue)(fieldValue);

      var expandIconClassname = (0, _classnames2.default)('fa expander-icon', {
        'fa-minus-square-o': expanded,
        'fa-plus-square-o': !expanded
      });

      var fieldClassname = (0, _classnames2.default)('json-field', {
        'non-expandable': valueIsPlain
      });

      var fieldKeyLabel = fieldKey;
      if (isArrayElement) {
        fieldKeyLabel = '[' + fieldKeyLabel + ']';
      }

      return React.createElement(
        'div',
        { className: fieldClassname },
        !valueIsPlain && React.createElement('i', { className: expandIconClassname, onClick: this.toggleExpanded }),
        React.createElement(
          'strong',
          { className: 'field-key' },
          fieldKeyLabel,
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
  fieldKey: _propTypes2.default.string,
  fieldValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.number, _propTypes2.default.bool]),
  path: _propTypes2.default.arrayOf(_propTypes2.default.string),
  isArrayElement: _propTypes2.default.bool
};
JSONField.defaultProps = {
  path: []
};
JSONField.contextTypes = {
  jsonEditor: _propTypes2.default.object
};
exports.default = JSONField;