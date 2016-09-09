import React from 'react';
import { shallow } from 'enzyme';
import SelectField from '../SelectField';

describe('<SelectField/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render html select field', () => {
    wrapper = shallow(<SelectField name="test" title="Test" options={['Option 1', 'Option 2']}/>);

    const div = wrapper.find('div.form-group');
    expect(div.length).toBe(1);

    const label = div.find('label');
    expect(label.prop('htmlFor')).toBe('test');
    expect(label.text()).toBe('Test');

    const select = div.find('select');
    expect(select.length).toBe(1);
    expect(select.prop('name')).toBe('test');
    expect(select.hasClass('form-control')).toBe(true);

    const options = select.find('option');
    expect(options.length).toBe(3);
    expect(options.at(0).prop('value')).toBe('');
    expect(options.at(0).text()).toBe('Bitte wählen');
    expect(options.at(1).prop('value')).toBe('Option 1');
    expect(options.at(1).text()).toBe('Option 1');
    expect(options.at(2).prop('value')).toBe('Option 2');
    expect(options.at(2).text()).toBe('Option 2');
  });

});