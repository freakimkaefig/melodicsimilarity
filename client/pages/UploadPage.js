import React from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import UploadView from '../components/Upload/UploadView';

export default AuthenticatedComponent(class UploadPage extends React.Component {
  static displayName = 'UploadPage';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title={`Upload // ${APP_NAME}`}>
        <div>
          <h1>Liedblattdateien hochladen</h1>
          <UploadView />
        </div>
      </DocumentTitle>
    );
  }
});