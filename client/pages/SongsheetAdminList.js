import React, { PropTypes } from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import { ROWS } from '../constants/SongsheetConstants';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import LoadingOverlay from '../components/LoadingOverlay';
import FileGrid from '../components/FileGrid';
import {
  Pagination,
  Button
} from 'react-bootstrap';


export default AuthenticatedComponent(class SongsheetAdminList extends React.Component {
  static displayName = 'SongsheetAdminList';

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

  onSongsheetDelete(event) {
    SongsheetService.deleteSongsheet(event.target.parentNode.dataset.signature);
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
      <DocumentTitle title={`Liedblatt-Verwaltung // ${APP_NAME}`}>
        <div>
          <h1 className="text-center">Liedblatt-Verwaltung</h1>
          <LoadingOverlay loading={filteredsongsheets <= 0} />
          <div className="offset-container">
            <FileGrid songsheets={filteredsongsheets} urlPrefix="/admin/songsheets/" customField={<Button bsStyle="danger" onClick={this.onSongsheetDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"></i> Löschen</Button>}/>
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
});