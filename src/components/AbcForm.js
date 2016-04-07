import React, { PropTypes } from 'react';
import AbcActions from '../actions/AbcActions';

require('../stylesheets/AbcForm.less');

export default class AbcForm extends React.Component {

  handleChange(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (function() {
      return function(e) {
        AbcActions.setJsonString(JSON.parse(e.target.result));
      }
    })(file);
  }

  render() {
    return (
      <div>
        <hr/>
        <h3>Upload Music JSON</h3>
        <form>
          <div className="form-group">
            <span className="btn btn-primary btn-file">
              Browse <input type="file" id="jsonFile" onChange={this.handleChange} />
            </span>
          </div>
        </form>
      </div>
    );
  }
}