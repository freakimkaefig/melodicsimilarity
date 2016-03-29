import React from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';
import AbcForm from '../components/AbcForm';
import AbcViewer from '../components/AbcViewer';

export default AuthenticatedComponent(class AdminPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="Admin // MusicIR">
        <div>
          <h1>Hello Admin Page!</h1>
          <AbcForm />
          <AbcViewer />
        </div>
      </DocumentTitle>
    );
  }
});