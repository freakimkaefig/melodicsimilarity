import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import InputField from '../InputField';

describe('<InputField/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render empty', () => {
    wrapper = shallow(<InputField name="test" title="Test" input="text"/>);

    const div = wrapper.find('div.form-group');
    expect(div.length).toBe(1);

    const label = div.find('label');
    expect(label.prop('htmlFor')).toBe('test');
    expect(label.text()).toBe('Test');

    const input = div.find('input');
    expect(input.length).toBe(1);
    expect(input.prop('type')).toBe('text');
    expect(input.prop('name')).toBe('test');
    expect(input.prop('placeholder')).toBe('Test');
    expect(input.prop('onChange')).toBeDefined();
  });

  it('should as readonly', () => {
    wrapper = shallow(<InputField name="test" title="Test" input="text" readonly/>);
    expect(wrapper.find('input').prop('readOnly')).toBe('readOnly');
  });

  it('should propagate change event', () => {
    const changeSpy = sinon.spy();
    wrapper = shallow(<InputField name="test" title="Test" input="text" onChange={changeSpy}/>);

    const value = 'changed value';
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: value } });
    expect(changeSpy.callCount).toBe(1);
    // expect(changeSpy.args).toBe('test');
    console.log(changeSpy.args[0][1]);
    expect(changeSpy.args[0][1]).toBe(value);
  });

});