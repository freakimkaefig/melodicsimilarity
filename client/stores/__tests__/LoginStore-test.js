import {LOGIN_USER, LOGOUT_USER} from '../../constants/LoginConstants';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

jest.mock('../../dispatchers/AppDispatcher');

describe('LoginStore', () => {

  var AppDispatcher;
  var LoginStore;
  var callback;

  var actionLoginUser = {
    actionType: LOGIN_USER,
    jwt: jsonwebtoken.sign(_.omit({
      username: 'admin',
      hash: '$2a$10$fa5PEv5KiADJtD5jlL8b1e48vbcVmTW4mSObSH/rgKqplquA7mJki'
    }, 'password'), 'admin', { expiresIn: 60*60*5 })
  };

  var actionLogoutUser = {
    actionType: LOGOUT_USER
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    LoginStore = require('../LoginStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with no user and no jwt', () => {
    expect(LoginStore.user).toBeNull();
    expect(LoginStore.jwt).toBeNull();
  });

  it('logs in user', () => {
    callback(actionLoginUser);
    expect(LoginStore.user.username).toEqual('admin');
    expect(bcrypt.compareSync('admin', LoginStore.user.hash)).toBe(true);
  });

  it('logs out user', () => {
    callback(actionLogoutUser);
    expect(LoginStore.user).toBeNull();
    expect(LoginStore.jwt).toBeNull();
  });

  it('should return login status', () => {
    expect(LoginStore.isLoggedIn()).toBe(false);

    callback(actionLoginUser);
    expect(LoginStore.isLoggedIn()).toBe(true);
  });

});