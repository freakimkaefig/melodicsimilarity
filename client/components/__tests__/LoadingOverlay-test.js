import React from 'react';
import { shallow } from 'enzyme';
import LoadingOverlay from '../LoadingOverlay';

describe('<LoadingOverlay/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render in loading state', () => {
    wrapper = shallow(<LoadingOverlay loading={true}/>);
    const div = wrapper.find('div.loading-overlay');
    expect(div.length).toBe(1);
    expect(div.prop('style').zIndex).toBe(999999);
    expect(div.prop('style').opacity).toBe(1);
    expect(div.children().length).toBe(1);
    expect(div.children().hasClass('fa')).toBe(true);
    expect(div.children().hasClass('fa-circle-o-notch')).toBe(true);
    expect(div.children().hasClass('fa-spin')).toBe(true);
  });

  it('should render in idle state', () => {
    wrapper = shallow(<LoadingOverlay loading={false}/>);
    const div = wrapper.find('div.loading-overlay');
    expect(div.length).toBe(1);
    expect(div.prop('style').zIndex).toBe(-1);
    expect(div.prop('style').opacity).toBe(0);
  });

});
