import sinon from 'sinon';
import {
  LOGIN_USER,
  LOGOUT_USER
} from '../../constants/LoginConstants';

jest.mock('../../dispatchers/AppDispatcher');
jest.mock('react-router');

describe('LoginActions', () => {

  var AppDispatcher;
  var LoginActions;
  var browserHistory;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    LoginActions = require('../LoginActions').default;

    browserHistory = require('react-router').browserHistory;
    window.localStorage = require('../../__mocks__/storageMock');
  });

  it('dispatches user login', () => {
    sinon.spy(window.localStorage, 'getItem');
    sinon.spy(window.localStorage, 'setItem');
    sinon.spy(browserHistory, 'push');
    LoginActions.loginUser('token');

    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LOGIN_USER,
      jwt: 'token'
    });
    expect(window.localStorage.getItem.callCount).toBe(1);
    expect(window.localStorage.getItem.args[0][0]).toBe('jwt');
    expect(browserHistory.push.callCount).toBe(1);
    expect(browserHistory.push.args[0][0]).toBe('/');
    expect(window.localStorage.setItem.callCount).toBe(1);
    expect(window.localStorage.setItem.args[0][0]).toBe('jwt');
    expect(window.localStorage.setItem.args[0][1]).toBe('token');

    window.localStorage.getItem.restore();
    window.localStorage.setItem.restore();
    browserHistory.push.restore();
  });

  it('dispatches already logged in', () => {
    window.localStorage.getItem = (key) => {
      return 'token';
    };
    sinon.spy(window.localStorage, 'getItem');
    sinon.spy(window.localStorage, 'setItem');
    sinon.spy(browserHistory, 'push');
    LoginActions.loginUser('token');

    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LOGIN_USER,
      jwt: 'token'
    });
    expect(window.localStorage.getItem.callCount).toBe(1);
    expect(window.localStorage.getItem.args[0][0]).toBe('jwt');
    expect(browserHistory.push.callCount).toBe(0);
    expect(window.localStorage.setItem.callCount).toBe(0);

    window.localStorage.getItem.restore();
    window.localStorage.setItem.restore();
    browserHistory.push.restore();
  });

  it('dispatches user logout', () => {
    sinon.spy(window.localStorage, 'removeItem');
    sinon.spy(browserHistory, 'push');
    LoginActions.logoutUser();

    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LOGOUT_USER
    });
    expect(browserHistory.push.callCount).toBe(1);
    expect(browserHistory.push.args[0][0]).toBe('/');
    expect(window.localStorage.removeItem.callCount).toBe(1);
    expect(window.localStorage.removeItem.args[0][0]).toBe('jwt');

    window.localStorage.removeItem.restore();
    browserHistory.push.restore();
  });

});