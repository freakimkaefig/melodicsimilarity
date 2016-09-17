import React from 'react';
import { mount } from 'enzyme';
import ImprintPage from '../ImprintPage';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../../constants/AppConstants';

describe('<ImprintPage/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
    wrapper = mount(<ImprintPage/>);
  });

  it('should render <DocumentTitle/>', () => {
    expect(wrapper.find(DocumentTitle).length).toBe(1);
    expect(wrapper.find(DocumentTitle).props().title).toEqual('Impressum // ' + APP_NAME);
  });

});