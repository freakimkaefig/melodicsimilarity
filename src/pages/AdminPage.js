import React from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';
import UploadView from '../components/UploadView';

export default AuthenticatedComponent(class AdminPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="Admin // MusicIR">
        <div>
          <h1>Hello Admin Page!</h1>
          <UploadView />
        </div>
      </DocumentTitle>
    );
  }
});