import {LOGIN_USER, LOGOUT_USER} from '../../constants/LoginConstants';
import AppDispatcher from '../../dispatchers/AppDispatcher';
import LoginStore from '../LoginStore';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

describe('LoginStore', function() {

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

  // beforeEach(function() {
    // AppDispatcher = require('../../dispatchers/AppDispatcher');
    // LoginStore = require('../LoginStore');
    // console.log(AppDispatcher.register);
    // callback = AppDispatcher.register.mock.calls[0][0];
    // this.dispatcher = new AppDispatcher();
    // this.store = new LoginStore({ dispatcher: AppDispatcher });
  // });

  // it('registers a callback with the dispatcher', function() {
  //   expect(AppDispatcher.register.mock.calls.length).toBe(1);
  // });

  it('should initialize with no user and no jwt', function() {
    var user = LoginStore.user;
    var jwt = LoginStore.jwt;
    expect(user).toEqual(null);
    expect(jwt).toEqual(null);
  });

  it('logs in user', function() {
    AppDispatcher.dispatch(actionLoginUser);
    var user = LoginStore.user;

    expect(user.username).toEqual('admin');
    expect(bcrypt.compareSync('admin', user.hash)).toBe(true);
  });

  it('logs out user', function() {
    AppDispatcher.dispatch(actionLogoutUser);
    var user = LoginStore.user;
    var jwt = LoginStore.user;
    expect(user).toEqual(null);
    expect(jwt).toEqual(null);
  });
});