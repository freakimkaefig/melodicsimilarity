import React from 'react';
import { mount } from 'enzyme';
import HomePage from '../HomePage';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../../constants/AppConstants';

describe('<HomePage/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
    wrapper = mount(<HomePage/>);
  });

  it('should render <DocumentTitle/>', () => {
    expect(wrapper.find(DocumentTitle).length).toBe(1);
    expect(wrapper.find(DocumentTitle).props().title).toEqual('Home // ' + APP_NAME);
  });

});