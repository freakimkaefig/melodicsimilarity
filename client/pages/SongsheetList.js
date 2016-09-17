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
  static displayName = 'SongsheetList';

  constructor(props) {
    super(props);

    this.state = {
      songsheets: SongsheetStore.songsheets,
      start: SongsheetStore.start,
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
      start: SongsheetStore.start,
      activePage: (SongsheetStore.start / ROWS) + 1,
      numPages: this.getNumPages()
    });
  }

  handleSelect(eventKey) {
    // Resest songsheets (triggers LoadingOverlay)
    this.setState({
      songsheets: []
    });

    // Load desired page
    SongsheetService.loadList((eventKey - 1) * ROWS, ROWS);
  }

  render() {

    let {
      songsheets,
      start,
      numPages,
      activePage
    } = this.state;

    let filteredsongsheets = songsheets.slice(start, start + ROWS);

    return (
      <DocumentTitle title={`Liedblätter // ${APP_NAME}`}>
        <div>
          <h1 className="text-center">Liedblatt-Galerie</h1>
          <LoadingOverlay loading={filteredsongsheets <= 0} />
          <div className="offset-container">
            <FileGrid songsheets={filteredsongsheets} />
          </div>
          <div className="text-center">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              items={numPages}
              maxButtons={7}
              activePage={activePage}
              onSelect={this.handleSelect.bind(this)} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}