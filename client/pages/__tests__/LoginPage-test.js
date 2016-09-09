import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import LoginPage from '../LoginPage';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../../constants/AppConstants';

describe('<LoginPage/>', () => {

  var wrapper;

  beforeEach(() => {
    jest.resetModules();
    wrapper = mount(<LoginPage/>);
  });

  it('should initialize with empty state', () => {
    expect(wrapper.state('user')).toBe('');
    expect(wrapper.state('password')).toBe('');
  });

  it('should render <DocumentTitle/>', () => {
    expect(wrapper.find(DocumentTitle).length).toBe(1);
    expect(wrapper.find(DocumentTitle).props().title).toEqual('Login // ' + APP_NAME);
  });

  it('should render input field for username', () => {
    let field = wrapper.find('input[id="user"]');
    expect(field.length).toBe(1);
    expect(field.props().value).toBe('');
    expect(field.props().onChange).toBeDefined();
    expect(typeof field.props().onChange).toBe('function');

    field.simulate('change', { target: { id: 'user', value: 'test' } });
    expect(wrapper.state('user')).toBe('test');
    expect(field.props().value).toBe('test');
  });

  it('should render input field for password', () => {
    let field = wrapper.find('input[id="password"]');
    expect(field.length).toBe(1);
    expect(field.props().value).toBe('');
    expect(field.props().type).toBe('password');
    expect(field.props().onChange).toBeDefined();
    expect(typeof field.props().onChange).toBe('function');

    field.simulate('change', { target: { id: 'password', value: 'password' } });
    expect(wrapper.state('password')).toBe('password');
    expect(field.props().value).toBe('password');
  });

  it('should render submit button', () => {
    sinon.spy(LoginPage.prototype, 'login');
    jest.resetModules();
    wrapper = mount(<LoginPage/>);

    let button = wrapper.find('button[type="submit"]');
    expect(button.length).toBe(1);
    expect(button.props().onClick).toBeDefined();
    expect(typeof button.props().onClick).toBe('function');

    button.simulate('click');
    expect(LoginPage.prototype.login.callCount).toBe(1);
    LoginPage.prototype.login.restore();
  });

});