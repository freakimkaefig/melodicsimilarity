import React, { PropTypes } from 'react';

export default class InputField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onChange(this, event.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input
          type={this.props.input}
          name={this.props.name}
          className="form-control"
          placeholder={this.props.title}
          onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}
