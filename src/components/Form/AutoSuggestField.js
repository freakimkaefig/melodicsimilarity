import React, { PropTypes } from 'react';
import AutoSuggest from 'react-autosuggest';
import fuzzy from 'fuzzy';
import '../../stylesheets/AutoSuggestField.less';

export default class AutoSuggestField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
    facets: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestions: this.getSuggestions(''),
      value: ''
    };

    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    } else {
      let results = fuzzy.filter(inputValue, this.props.facets);
      return results.map(item => {
        return item.string;
      }).slice(0, 15);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  getSuggestionValue(suggestion) {
    return suggestion;
  }

  renderSuggestion(suggestion) {
    return (
      <span>{suggestion}</span>
    );
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  handleChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
    this.props.onChange(this, newValue);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: this.props.title,
      value,
      onChange: this.handleChange.bind(this)
    };

    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <AutoSuggest
          id={this.props.name}
          suggestions={suggestions}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
      </div>
    );
  }
}
