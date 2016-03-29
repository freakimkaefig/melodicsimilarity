import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import LoginActions from './actions/LoginActions';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import AdminPage from './pages/AdminPage';


var router = (
  <Router history={browserHistory}>
    <Route name="home" path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route name="login" path="login" component={LoginPage} />
      <Route name="logout" path="logout" component={LogoutPage} />
      <Route name="admin" path="admin" component={AdminPage} onEnter={AdminPage.willTransitionTo} />
    </Route>
  </Router>
);

let jwt = localStorage.getItem('jwt');
if (jwt) {
  LoginActions.loginUser(jwt);
}

ReactDOM.render(router, document.getElementById('root'));
