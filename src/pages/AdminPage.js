import React from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';

export default AuthenticatedComponent(class AdminPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="Admin // MusicIR">
        <h1>Hello Admin Page!</h1>
      </DocumentTitle>
    );
  }
});