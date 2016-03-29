import React, { PropTypes } from 'react';
import AbcActions from '../actions/AbcActions';

export default class AbcForm extends React.Component {

  handleChange(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (function(theFile) {
      return function(e) {
        // console.log(e.target.result);
        AbcActions.setJsonString(JSON.parse(e.target.result));
      }
    })(file);
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="jsonFile">JSON file</label>
          <input type="file" id="jsonFile" onChange={this.handleChange} />
        </div>
      </form>
    );
  }
}