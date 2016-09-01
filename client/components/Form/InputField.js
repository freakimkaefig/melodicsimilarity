import React, { PropTypes } from 'react';

export default class InputField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
    value: PropTypes.string,
    readonly: PropTypes.bool,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onChange(this, event.target.value);
  }

  render() {
    let {
      name,
      title,
      input,
      value,
      readonly
    } = this.props;

    let opts ={};
    opts['type'] = input;
    opts['name'] = name;
    opts['placeholder'] = title;
    opts['value'] = value;
    if (readonly) {
      opts['readOnly'] = 'readOnly';
    }

    return (
      <div className="form-group">
        <label htmlFor={name}>{title}</label>
        <input
          className="react-autosuggest__input"
          onChange={this.handleChange.bind(this)}
          {...opts} />
      </div>
    );
  }
}
