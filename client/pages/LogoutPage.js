import React from 'react';
import Auth from '../services/AuthService';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';

export default class LogoutPage extends React.Component {
  static displayName = 'HomePage';
  
  componentDidMount() {
    Auth.logout();
  }
  
  render() {
    return (
      <DocumentTitle title={`Admin // ${APP_NAME}`}>
        <h1>You're successfully logged out!</h1>
      </DocumentTitle>
    );
  }
}