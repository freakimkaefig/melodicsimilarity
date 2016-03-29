import React from 'react';
import Auth from '../services/AuthService';
import DocumentTitle from 'react-document-title';

export default class LogoutPage extends React.Component {
  
  componentDidMount() {
    Auth.logout();
  }
  
  render() {
    return (
      <DocumentTitle title="Admin // MusicIR">
        <h1>You're successfully logged out!</h1>
      </DocumentTitle>
    );
  }
}