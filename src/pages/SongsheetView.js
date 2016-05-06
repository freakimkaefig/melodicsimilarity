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
      file: null,
      loading: true
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);

    SongsheetService.loadItem(this.props.params.signature);

    // let songsheet = SongsheetStore.songsheets.find(songsheet => {
    //   return songsheet.signature === this.props.params.signature;
    // });
    // console.log(songsheet);
    // if (songsheet) {
    //   this.setState({
    //     file: songsheet,
    //     loading: false
    //   });
    // } else {
    //   console.log(this.props);
    //   SongsheetService.loadItem(this.props.params.signature);
    // }
  }

  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({
      file: SongsheetStore.songsheet,
      loading: false
    });
  }

  _getImageView(file) {
    if (file !== null) {
      if (typeof file.image !== 'undefined') {
        return (
          <ImageZoom itemKey={0} image={file.image} />
        );
      }
    }
  }

  _getAbcViewer(file) {
    if (file !== null) {
      if (typeof file.abc !== 'undefined') {
        return (
          <AbcViewer abc={file.abc} itemKey={0}/>
        );
      }
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
              { this._getImageView(this.state.file) }
            </div>
            <div className="col-xs-12 col-sm-8">
              { this._getAbcViewer(this.state.file) }
              { this._getMetadataViewer(this.state.file) }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}