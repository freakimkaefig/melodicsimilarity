import {LOGIN_USER, LOGOUT_USER} from '../../constants/LoginConstants';
import AppDispatcher from '../../dispatchers/AppDispatcher';
import LoginStore from '../LoginStore';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

describe('LoginStore', () => {

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

  it('should initialize with no user and no jwt', () => {
    let {
      user,
      jwt
    } = LoginStore;

    expect(user).toBeNull();
    expect(jwt).toBeNull();
  });

  it('logs in user', () => {
    AppDispatcher.dispatch(actionLoginUser);
    let {
      user
    } = LoginStore;

    expect(user.username).toEqual('admin');
    expect(bcrypt.compareSync('admin', user.hash)).toBe(true);
  });

  it('logs out user', () => {
    AppDispatcher.dispatch(actionLogoutUser);
    let {
      user,
      jwt
    } = LoginStore;

    expect(user).toBeNull();
    expect(jwt).toBeNull();
  });

});