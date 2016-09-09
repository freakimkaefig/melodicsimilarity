import React from 'react';
import { shallow } from 'enzyme';
import LoadingItem from '../LoadingItem';

describe('<LoadingItem/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render in loading state', () => {
    wrapper = shallow(<LoadingItem loading={true}/>);
    const div = wrapper.find('div.loading-item');
    expect(div.length).toBe(1);
    expect(div.prop('style').display).toBe('block');
    expect(div.children().length).toBe(1);
    expect(div.children().hasClass('fa')).toBe(true);
    expect(div.children().hasClass('fa-circle-o-notch')).toBe(true);
    expect(div.children().hasClass('fa-spin')).toBe(true);
  });

  it('should render in idle state', () => {
    wrapper = shallow(<LoadingItem loading={false}/>);
    const div = wrapper.find('div.loading-item');
    expect(div.length).toBe(1);
    expect(div.prop('style').display).toBe('none');
  });

});
