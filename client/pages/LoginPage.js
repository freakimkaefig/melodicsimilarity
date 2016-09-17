import React from 'react';
import Auth from '../services/AuthService';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';

export default class LoginPage extends React.Component {
  static displayName = 'HomePage';

  constructor() {
    super();
    this.state = {
      user: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  login(e) {
    e.preventDefault();
    Auth.login(this.state.user, this.state.password)
      .catch(function(err) {
        alert("There's an error logging in");
        console.log("Error logging in", err);
      });
  }

  onChange(e) {
    let stateObject = {};
    stateObject[e.target.id] = e.target.value;
    this.setState(stateObject);
  }

  render() {
    let {
      user,
      password
    } = this.state;

    return (
      <DocumentTitle title={`Login // ${APP_NAME}`}>
        <div className="login jumbotron center-block">
          <h1>Login</h1>
          <form role="form">
            <div className="form-group">
              <label htmlFor="user">Benutzername</label>
              <input type="text" value={user} onChange={this.onChange} className="form-control" id="user" placeholder="Username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Passwort</label>
              <input type="password" value={password} onChange={this.onChange} className="form-control" id="password" ref="password" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-default" onClick={this.login.bind(this)}>Login</button>
          </form>
        </div>
      </DocumentTitle>
    )
  }
}
