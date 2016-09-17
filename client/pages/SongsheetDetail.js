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
  static displayName = 'SongsheetDetail';

  constructor(props) {
    super(props);

    this.state = {
      songsheets: SongsheetStore.songsheets,
      similarityScores: SongsheetStore.similarityScores,
      loading: false,
    };

    this.onSongsheetStoreChange = this.onSongsheetStoreChange.bind(this);
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onSongsheetStoreChange);

    if (!this.state.songsheet) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(this.props.params.signature);
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
      songsheets: SongsheetStore.songsheets,
      similarityScores: SongsheetStore.similarityScores,
      loading: false
    });
  }

  render() {
    let signature = this.props.params.signature;

    let {
      songsheets,
      similarityScores,
      loading
    } = this.state;

    let currentSongsheet = songsheets.find((item) => {
      return item.signature === signature;
    });

    return (
      <DocumentTitle title={`Liedblatt - ${signature} // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={loading} />

          <div className="offset-container">
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
          </div>

          <div className="offset-container">
            <SongsheetView
              songsheet={currentSongsheet}
              songsheets={songsheets}
              similarityScores={similarityScores}
            />
          </div>

        </div>
      </DocumentTitle>
    )
  }
}