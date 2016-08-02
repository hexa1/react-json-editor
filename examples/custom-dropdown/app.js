import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactSelect from 'react-select';
import JSONEditor from 'react-json-editor';
import exampleJson from '../example.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      json: exampleJson,
    };
  }

  render() {
    const { json } = this.state;

    return (
      <div className="row">
        <div className="col-md-4">
          <pre>{ JSON.stringify(json, null, 2) }</pre>
        </div>
        <div className="col-md-8">
          <JSONEditor
            json={json}
            onChange={updatedJson => this.setState({ json: updatedJson })}
            dropdownFactory={(options, value, onChange, props) => (
              <ReactSelect
                options={options}
                value={value}
                onChange={opt => onChange(opt.value)}
                clearable={false}
                searchable={false}
                {...props}
              />
            )}
          />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
