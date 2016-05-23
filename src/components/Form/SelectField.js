import React, { PropTypes } from 'react';

export default class SelectField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  _getSelectOptions(options) {
    return options.map((option, index) => {
      return (
        <option key={index} value={option}>{option}</option>
      );
    });
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <select name={this.props.name} className="form-control">
          <option value="">Bitte wählen</option>
          {this._getSelectOptions(this.props.options)}
        </select>
      </div>
    );
  }
}
