import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import LoadingOverlay from '../components/LoadingOverlay';
import FileGrid from '../components/FileGrid';


export default class SongsheetList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songsheets: SongsheetStore.songsheets,
      metadata: SongsheetStore.metadata
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);
    SongsheetService.loadList();
  }
  
  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({
      songsheets: SongsheetStore.songsheets,
      metadata: SongsheetStore.metadata
    });
  }

  render() {
    return (
      <DocumentTitle title={`Liedblätter // ${APP_NAME}`}>
        <div>
          <h1>Liedblätter</h1>
          <LoadingOverlay loading={this.state.songsheets <= 0} />
          <FileGrid files={this.state.songsheets} metadata={this.state.metadata} />
        </div>
      </DocumentTitle>
    )
  }
}