import AppDispatcher from '../dispatchers/AppDispatcher';
import { browserHistory } from 'react-router';
import { LOGIN_USER, LOGOUT_USER } from '../constants/LoginConstants.js';

/**
 * `Actions` are generated by `Views` and processed by the `Dispatcher` according to the
 * Flux application architecture.
 *
 */
export default {
  loginUser: (jwt) => {
    var savedJwt = localStorage.getItem('jwt');
  
    AppDispatcher.dispatch({
      actionType: LOGIN_USER,
      jwt: jwt
    });
  
    if (savedJwt !== jwt) {
      browserHistory.push('/admin');
      localStorage.setItem('jwt', jwt);
    }
  },
  logoutUser: () => {
    browserHistory.push('/');
    localStorage.removeItem('jwt');
    AppDispatcher.dispatch({
      actionType: LOGOUT_USER
    });
  }
}