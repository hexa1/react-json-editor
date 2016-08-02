# React JSON Editor

## Peer Dependencies
You must have these packages installed in your project to use this component:

  - `react ^0.14 || ^15.0.0-rc || ^15.0`
  - `react-dom ^0.14 || ^15.0.0-rc || ^15.0`
  - `react-bootstrap ^0.29.3`
  - `react-select ^0.7.0`

## Usage
```js
import JSONEditor from 'react-json-editor';

// in your component
<JSONEditor json={{ foo: 'bar' }} onChange={json => console.log(json)} />
```

You'll also need to include the css which is located in `dist/jsonEditor.css'.

### Props

|Prop      | Type             | Default     | Description
|----------|------------------|-------------|-------------
|`json`    | object or string | `{}`        | the json object you want to edit. if you pass a string, the editor will attempt to parse it with `JSON.parse()`.
|`onChange`| function         | `noop`      | called whenever a change occurs. the updated json is passed as the first and only argument to the function.

## Development

### Building
`npm run build` will run the js through babel and the scss through node-sass and output into `dist/`.

The `dist` folder should be committed to the repo.

### Linting
`npm run lint` - please lint before committing any code

## Known Issues
  - Typing a decimal as the last character in a number field doesn't work because of the way we coerce the type - if the field is a number type, we try to `parseFloat()` it, which parses a value like `1.` to `1`. Adding the decimal anywhere but the last character will work, so a workaround to trying to type `1.1` would be to type `11`, then insert the decimal between the `1`s.

## TODO
  - Remove react-bootstrap dependency (used for tooltips/popovers)
  - Remove react-select dependency (used for dropdown)
  - Allow passing input & select factories instead of using bootstrap/react-select components
  - Add AMD/UMD module support via webpack
  - Tests
  - Examples
