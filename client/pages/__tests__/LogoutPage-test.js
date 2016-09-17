import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import LogoutPage from '../LogoutPage';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../../constants/AppConstants';

jest.mock('../../services/AuthService');

describe('<LogoutPage/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
    wrapper = mount(<LogoutPage/>);
  });

  it('should render <DocumentTitle/>', () => {
    expect(wrapper.find(DocumentTitle).length).toBe(1);
    expect(wrapper.find(DocumentTitle).props().title).toEqual('Logout // ' + APP_NAME);
  });

  it('should logout when mounting', () => {
    sinon.spy(LogoutPage.prototype, 'componentDidMount');
    jest.resetModules();
    wrapper = mount(<LogoutPage/>);

    expect(LogoutPage.prototype.componentDidMount.callCount).toBe(1);
    LogoutPage.prototype.componentDidMount.restore();
  });

});