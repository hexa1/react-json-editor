# React JSON Editor

## Peer Dependencies
You must have these packages installed in your project to use this component:

  - `react ^0.14 || ^15.0.0-rc || ^15.0`
  - `react-dom ^0.14 || ^15.0.0-rc || ^15.0`
  - `react-bootstrap ^0.29.3` (for tooltips and popovers)

The editor also uses some Font Awesome icons so you should have that as well

## Usage
```js
import JSONEditor from 'react-json-editor';

// in your component
<JSONEditor json={{ foo: 'bar' }} onChange={json => console.log(json)} />
```

You'll also need to include the css which is located in `dist/jsonEditor.css`.

#### Custom dropdowns
The editor uses a dropdown in two places: 1) to select the field type (string, map, bool, etc) and 2) to select the value for a boolean field.

You can pass the `dropdownFactory` prop to render your own dropdown:

```js
<JSONEditor
  dropdownFactory={(options, value, onChange, props) => (
    <MyOwnDropdown
      options={options}
      value={value}
      onChange={onChange}
      {...props}
    />
  )}
/>
```

`options` will be an array of objects: `[{ label, value }, { label, value }]`. `label` and `value` will always be strings.

`value` will be the currently selected value, always a string to match the `value` in the `options` object.

`onChange` will be a function that should be called when an option is selected. the function takes a single argument with the value of the selected option

The following additional props may be passed in the `props` argument:
  - `placeholder`: placeholder value that can be displayed if the field has no value

#### Props

|Prop              | Type             | Default     | Description
|------------------|------------------|-------------|-------------
|`json`            | object or string | `{}`        | the json object you want to edit. if you pass a string, the editor will attempt to parse it with `JSON.parse()`.
|`onChange`        | function         | `noop`      | called whenever a change occurs: `function(updatedJson) {}`
|`dropdownFactory` | function         |             | factory to render a custom dropdown element for selecting the field type and value if type is boolean: `function(options = [], value, props={}) {}`

## Development

#### Examples
To view the examples, run `npm start` then point your browser to [http://localhost:9009](http://localhost:9009)

#### Building
`npm run build` will run the js through babel and the scss through node-sass and output into `dist/`.

The `dist` folder should be committed to the repo for now.

#### Linting
`npm run lint` - please lint before committing any code

## Known Issues
  - Typing a decimal as the last character in a number field doesn't work because of the way we coerce the type - if the field is a number type, we try to `parseFloat()` it, which parses a value like `1.` to `1`. Adding the decimal anywhere but the last character will work, so a workaround to trying to type `1.1` would be to type `11`, then insert the decimal between the `1`s.

## TODO
  - Remove react-bootstrap dependency (used for tooltips/popovers)
  - Allow passing an input factory or custom classname instead of using bootstrap components
  - Remove font awesome dependency
  - Add AMD/UMD module support via webpack
  - Tests
