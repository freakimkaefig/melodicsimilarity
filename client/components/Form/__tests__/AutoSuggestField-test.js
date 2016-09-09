import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import AutoSuggestField from '../AutoSuggestField';
import AutoSuggest from 'react-autosuggest';

describe('<AutoSuggestField/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render empty', () => {
    sinon.spy(AutoSuggestField.prototype, 'getSuggestions');
    sinon.spy(AutoSuggestField.prototype, 'getSuggestionValue');
    sinon.spy(AutoSuggestField.prototype, 'renderSuggestion');
    sinon.spy(AutoSuggestField.prototype, 'onSuggestionsUpdateRequested');
    sinon.spy(AutoSuggestField.prototype, 'handleChange');
    wrapper = shallow(<AutoSuggestField name="test" title="Test" input="text" value=""/>);

    const div = wrapper.find('div.form-group');
    expect(div.length).toBe(1);

    const label = div.find('label');
    expect(label.prop('htmlFor')).toBe('test');
    expect(label.text()).toBe('Test');

    const autoSuggest = div.find(AutoSuggest);
    expect(autoSuggest.length).toBe(1);
    expect(autoSuggest.prop('id')).toBe('test');
    expect(autoSuggest.prop('suggestions').length).toBe(0);
    expect(autoSuggest.prop('onSuggestionsUpdateRequested')).toBeDefined();
    expect(autoSuggest.prop('getSuggestionValue')).toBeDefined();
    expect(autoSuggest.prop('renderSuggestion')).toBeDefined();
    expect(autoSuggest.prop('inputProps').placeholder).toBe('Test');
    expect(AutoSuggestField.prototype.getSuggestions.callCount).toBe(1);
    expect(AutoSuggestField.prototype.getSuggestions.returnValues[0].length).toBe(0);
    expect(AutoSuggestField.prototype.getSuggestionValue.callCount).toBe(0);
    expect(AutoSuggestField.prototype.renderSuggestion.callCount).toBe(0);
    expect(AutoSuggestField.prototype.onSuggestionsUpdateRequested.callCount).toBe(0);
    expect(AutoSuggestField.prototype.handleChange.callCount).toBe(0);
    AutoSuggestField.prototype.getSuggestions.restore();
    AutoSuggestField.prototype.getSuggestionValue.restore();
    AutoSuggestField.prototype.renderSuggestion.restore();
    AutoSuggestField.prototype.onSuggestionsUpdateRequested.restore();
    AutoSuggestField.prototype.handleChange.restore();
  });

  it('should handle change', () => {
    sinon.spy(AutoSuggestField.prototype, 'getSuggestions');
    sinon.spy(AutoSuggestField.prototype, 'getSuggestionValue');
    sinon.spy(AutoSuggestField.prototype, 'renderSuggestion');
    sinon.spy(AutoSuggestField.prototype, 'onSuggestionsUpdateRequested');
    const changeSpy = sinon.spy();
    const facets = ['Foo', 'Bar'];
    const value = '';
    wrapper = mount(<AutoSuggestField name="test" title="Test" input="text" value={value} onChange={changeSpy}/>);

    expect(AutoSuggestField.prototype.getSuggestions.callCount).toBe(1);
    expect(AutoSuggestField.prototype.getSuggestions.returnValues[0].length).toBe(0);
    expect(AutoSuggestField.prototype.getSuggestionValue.callCount).toBe(0);
    expect(AutoSuggestField.prototype.renderSuggestion.callCount).toBe(0);
    expect(AutoSuggestField.prototype.onSuggestionsUpdateRequested.callCount).toBe(0);

    // TODO: trigger chaange event and check call to handleChange
    // wrapper.setState({ value: 'F' });
    // wrapper.find('input').first().simulate('change', { newValue: 'F'});
    // console.log(changeSpy);
    // expect(changeSpy.callCount).toBe(1);

    AutoSuggestField.prototype.getSuggestions.restore();
    AutoSuggestField.prototype.getSuggestionValue.restore();
    AutoSuggestField.prototype.renderSuggestion.restore();
    AutoSuggestField.prototype.onSuggestionsUpdateRequested.restore();
  });

  it('should handle received facets', () => {
    sinon.spy(AutoSuggestField.prototype, 'getSuggestions');
    const facets = ['Foo', 'Bar'];
    const value = 'Fo';
    wrapper = mount(<AutoSuggestField name="test" title="Test" input="text" value={value} facets={facets}/>);

    expect(AutoSuggestField.prototype.getSuggestions.callCount).toBe(1);
    expect(AutoSuggestField.prototype.getSuggestions.returnValues[0]).toContain('Foo');
    expect(AutoSuggestField.prototype.getSuggestions.returnValues[0].length).toBe(1);

    AutoSuggestField.prototype.getSuggestions.restore();
  });

});