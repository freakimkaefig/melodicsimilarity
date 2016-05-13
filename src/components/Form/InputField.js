import React, { PropTypes } from 'react';

export default class InputField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input type={this.props.input}
               name={this.props.name}
               className="form-control"
               placeholder={this.props.title} />
      </div>
    );
  }
}
