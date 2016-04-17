import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import FileGrid from '../components/FileGrid';

export default class SongsheetList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songsheets: SongsheetStore.songsheets
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    SongsheetService.loadList();
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);
  }
  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({songsheets: SongsheetStore.songsheets});
  }

  render() {
    return (
      <DocumentTitle title="Liedblätter // MusicIR">
        <div>
          <h1>Songsheet List</h1>
          <FileGrid files={this.state.songsheets} />
        </div>
      </DocumentTitle>
    )
  }
}