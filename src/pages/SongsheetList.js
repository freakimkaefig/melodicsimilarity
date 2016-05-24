import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import { ROWS } from '../constants/SongsheetConstants';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import LoadingOverlay from '../components/LoadingOverlay';
import FileGrid from '../components/FileGrid';
import {Pagination} from 'react-bootstrap';


export default class SongsheetList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songsheets: SongsheetStore.songsheets,
      metadata: SongsheetStore.metadata,
      activePage: (SongsheetStore.start / ROWS) + 1,
      numPages: this.getNumPages()
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);
    SongsheetService.loadList(0, ROWS);
  }
  
  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  getNumPages() {
    return Math.ceil(SongsheetStore.totalCount / ROWS);
  }

  onStoreChange() {
    this.setState({
      songsheets: SongsheetStore.songsheets,
      metadata: SongsheetStore.metadata,
      activePage: (SongsheetStore.start / ROWS) + 1,
      numPages: this.getNumPages()
    });
  }

  handleSelect(event, {eventKey}) {
    event.preventDefault();

    // Load desired page
    SongsheetService.loadList((eventKey - 1) * ROWS, ROWS);

    // Resest songsheets (triggers LoadingOverlay)
    this.setState({
      songsheets: []
    });
  }

  render() {
    return (
      <DocumentTitle title={`Liedblätter // ${APP_NAME}`}>
        <div>
          <h1>Liedblätter</h1>
          <LoadingOverlay loading={this.state.songsheets <= 0} />
          <FileGrid files={this.state.songsheets} metadata={this.state.metadata} />
          <div className="text-center">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              items={this.state.numPages}
              maxButtons={7}
              activePage={this.state.activePage}
              onSelect={this.handleSelect.bind(this)} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}