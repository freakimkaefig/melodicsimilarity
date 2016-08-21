import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import LoadingOverlay from '../components/LoadingOverlay';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import SongsheetView from '../components/SongsheetView';
import SongsheetStore from '../stores/SongsheetStore';
import SongsheetService from '../services/SongsheetService';

export default class SongsheetDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: SongsheetStore.songsheets.find(item => {
        return item.signature === props.params.signature;
      }),
      metadata: SongsheetStore.metadata.find(item => {
        return item.signature === props.params.signature;
      }),
      similarityScores: SongsheetStore.similarityScores,
      similarSongsheets: SongsheetStore.similarSongsheets,
      similarMetadata: SongsheetStore.similarMetadata,
      loading: false,
    };

    this.onSongsheetStoreChange = this.onSongsheetStoreChange.bind(this);
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onSongsheetStoreChange);

    if (!this.state.file) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(this.props.params.signature);
    }

    if (this.state.similarSongsheets.length <= 0 || this.state.similarMetadata.length <= 0) {
      SongsheetService.loadSimilar(this.props.params.signature);
    }
  }

  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onSongsheetStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.signature !== nextProps.params.signature) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(nextProps.params.signature);
      SongsheetService.loadSimilar(nextProps.params.signature);
    }
  }

  onSongsheetStoreChange() {
    this.setState({
      file: SongsheetStore.songsheets.find(item => {
        return item.signature === this.props.params.signature;
      }),
      metadata: SongsheetStore.metadata.find(item => {
        return item.signature === this.props.params.signature;
      }),
      similarityScores: SongsheetStore.similarityScores,
      similarSongsheets: SongsheetStore.similarSongsheets,
      similarMetadata: SongsheetStore.similarMetadata,
      loading: false
    });
  }

  render() {
    let signature = this.props.params.signature;

    let {
      file,
      metadata,
      similarityScores,
      similarSongsheets,
      similarMetadata,
      loading
    } = this.state;

    return (
      <DocumentTitle title={`Liedblatt - ${signature} // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={loading} />

          <div className="row">
            <div className="col-xs-12">
              <Breadcrumb>
                <LinkContainer to="/songsheets" key={0}>
                  <Breadcrumb.Item>
                    Liedblätter
                  </Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>
                  {signature}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <SongsheetView
            file={file}
            metadata={metadata}
            similarityScores={similarityScores}
            similarSongsheets={similarSongsheets}
            similarMetadata={similarMetadata}
          />
        </div>
      </DocumentTitle>
    )
  }
}