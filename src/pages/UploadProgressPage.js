import React from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import ResultList from '../components/ResultList';
import UploadStore from '../stores/UploadStore';
import { browserHistory } from 'react-router';


export default AuthenticatedComponent(class UploadProgressPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      responses: this.getInitialResponses()
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  getInitialResponses() {
    return UploadStore.files.filter(file => {
      return file.upload === true;
    }).map(file => {
      return {
        value: {
          name: file.name,
          signature: file.metadata.signature,
          title: file.metadata.title
        },
        signature: file.metadata.signature,
        ok: 2
      };
    });
  }

  componentDidMount() {
    UploadStore.addChangeListener(this.onStoreChange);
    if (this.state.responses.length === 0) {
      browserHistory.push('/upload');
    }
  }
  componentWillUnmount() {
    UploadStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    var stateResponses = this.state.responses;
    for (var i = 0; i < stateResponses.length; i++) {
      var storeResponses = UploadStore.responses;
      for (var j = 0; j < storeResponses.length; j++) {
        if (stateResponses[i].value.signature === storeResponses[j].value.signature) {
          stateResponses[i] = storeResponses[j];
        }
      }
    }

    this.setState({
      responses: stateResponses
    });
  }

  render() {
    return (
      <DocumentTitle title={`Upload // ${APP_NAME}`}>
        <div>
          <h1>Upload wird ausgeführt ...</h1>
          <ResultList responses={this.state.responses} />
        </div>
      </DocumentTitle>
    );
  }
});