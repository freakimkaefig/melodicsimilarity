import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import LoadingOverlay from '../components/LoadingOverlay';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import ImageZoom from '../components/ImageZoom';
import AbcViewer from '../components/AbcViewer';
import MetadataViewer from '../components/MetadataViewer';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';


export default class SongsheetView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: SongsheetStore.songsheets.find(item => {
        return item.signature === props.params.signature;
      }),
      metadata: SongsheetStore.metadata.find(item => {
        return item.signature === props.params.signature;
      }),
      loading: false
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);

    if (!this.state.file) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(this.props.params.signature);
    }
  }

  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({
      file: SongsheetStore.songsheets.find(item => {
        return item.signature === this.props.params.signature;
      }),
      metadata: SongsheetStore.metadata.find(item => {
        return item.signature === this.props.params.signature;
      }),
      loading: false
    });
  }

  _getImageView(metadata) {
    if (typeof metadata !== 'undefined') {
      if (typeof metadata.imagename !== 'undefined') {
        return (
          <div className="col-xs-12">
            <ImageZoom itemKey={0} image={METADATA_IMAGE_BASE_URL + metadata.imagename} />
          </div>
        );
      }
    }
  }

  _getMetadataText(metadata) {
    if (typeof metadata !== 'undefined') {
      if (typeof metadata.text !== 'undefined') {
        return (
          <div className="col-xs-12 text">{metadata.text}</div>
        )
      }
    }
  }

  _getAbcViewer(file) {
    if (typeof file !== 'undefined') {
      if (typeof file.abc !== 'undefined') {
        return (
          <AbcViewer abc={file.abc} itemKey={0} player={true} />
        );
      }
    }
  }

  _getMetadataViewer(metadata) {
    if (typeof metadata !== 'undefined') {
      return (
        <MetadataViewer metadata={metadata} />
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
            <div className="col-xs-12 col-md-4">
              <div className="row">
                { this._getImageView(this.state.metadata) }
                { this._getMetadataText(this.state.metadata) }
              </div>
            </div>
            <div className="col-xs-12 col-md-7 col-md-offset-1">
              { this._getAbcViewer(this.state.file) }
              { this._getMetadataViewer(this.state.metadata) }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}