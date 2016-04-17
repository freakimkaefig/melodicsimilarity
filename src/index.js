import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import LoginActions from './actions/LoginActions';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import UploadPage from './pages/UploadPage';
import UploadSuccessPage from './pages/UploadSuccessPage';
import SongsheetList from './pages/SongsheetList';
import SongsheetView from './pages/SongsheetView';

var router = (
  <Router history={browserHistory}>
    <Route name="home" path="/" component={App}>
      <IndexRoute component={HomePage} />
      
      <Route name="login" path="login" component={LoginPage} />
      <Route name="logout" path="logout" component={LogoutPage} />
      
      <Route name="upload" path="upload" component={UploadPage} onEnter={UploadPage.willTransitionTo} />
      <Route name="upload-success" path="upload/success" component={UploadSuccessPage} onEnter={UploadSuccessPage.willTransitionTo} />
      
      <Route name="songsheets" path="songsheets" component={SongsheetList} />
      <Route name="songsheet" path="songsheets/:signature" component={SongsheetView} />
    </Route>
  </Router>
);

let jwt = localStorage.getItem('jwt');
if (jwt) {
  LoginActions.loginUser(jwt);
}

ReactDOM.render(router, document.getElementById('root'));
