import request from 'reqwest';
import when from 'when';
import { LOGIN_URL } from '../constants/LoginConstants';
import LoginActions from '../actions/LoginActions';

class AuthService {

  login(username, password) {
    return this.handleAuth(when(request({
      url: LOGIN_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      data: {
        username, password
      }
    })));
  }

  logout() {
    LoginActions.logoutUser();
  }

  handleAuth(loginPromise) {
    return loginPromise
      .then(response => {
        var jwt = response.id_token;
        LoginActions.loginUser(jwt);
        return true;
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default new AuthService();