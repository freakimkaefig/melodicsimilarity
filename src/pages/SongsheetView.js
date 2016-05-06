import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import LoadingOverlay from '../components/LoadingOverlay';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import ImageZoom from '../components/ImageZoom';
import AbcViewer from '../components/AbcViewer';
import MetadataViewer from '../components/MetadataViewer';
import { SONGSHEET_CONTEXT } from '../constants/SongsheetConstants';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';


export default class SongsheetView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      abc: null,
      image: null,
      file: null,
      loading: true
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);

    let songsheet = SongsheetStore.songsheets.find(songsheet => {
      return songsheet.signature === this.props.params.signature;
    });
    if (songsheet) {
      this.setState({
        abc: songsheet.abc,
        image: songsheet.image,
        loading: false
      });
    } else {
      SongsheetService.loadItem(this.props.params.signature);
    }
  }

  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    console.log(SongsheetStore.songsheet);
    this.setState({
      abc: SongsheetStore.songsheet.abc,
      image: SongsheetStore.songsheet.image,
      file: SongsheetStore.songsheet,
      loading: false
    });
  }

  _getAbcViewer(abc) {
    if (abc !== null) {
      return (
        <AbcViewer abc={abc} itemKey={0} />
      );
    }
  }

  _getMetadataViewer(file) {
    if (file !== null) {
      return (
        <MetadataViewer file={file} context={SONGSHEET_CONTEXT} />
      );
    }
  }

  render() {
    return (
      <DocumentTitle title={`Liedblatt - ${this.props.params.signature} // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={this.state.loading} />
          <div className="row">
            <div className="col-xs-12">
              <Breadcrumb>
                <LinkContainer to="/songsheets" key={0}>
                  <Breadcrumb.Item>
                    Liedblätter
                  </Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>
                  {this.props.params.signature}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h1>Songsheet View</h1>
            </div>
            <div className="col-xs-12 col-sm-4">
              <ImageZoom itemKey={0} image={this.state.image} />
            </div>
            <div className="col-xs-12 col-sm-8">
              { this._getAbcViewer(this.state.abc) }
              { this._getMetadataViewer(this.state.file) }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}