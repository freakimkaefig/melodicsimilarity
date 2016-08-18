import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import ArrayHelper from '../helpers/ArrayHelper';
import { APP_NAME } from '../constants/AppConstants';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import LoadingOverlay from '../components/LoadingOverlay';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import ImageZoom from '../components/ImageZoom';
import { json2abc } from 'musicjson2abc';
import AbcViewer from '../components/AbcViewer';
import MetadataViewer from '../components/MetadataViewer';
import FileGrid from '../components/FileGrid';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import SettingsStore from '../stores/SettingsStore';
import SearchStore from '../stores/SearchStore';
import '../stylesheets/SongsheetView.less';

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
      similarityThreshold: SettingsStore.settings['threshold'].value,
      similarityScores: SongsheetStore.similarityScores,
      similarSongsheets: SongsheetStore.similarSongsheets,
      similarMetadata: SongsheetStore.similarMetadata,
      loading: false,
      searchResults: SearchStore.results
    };

    this._init = this._init.bind(this);
    this.onSongsheetStoreChange = this.onSongsheetStoreChange.bind(this);
    this.onSettingsStoreChange = this.onSettingsStoreChange.bind(this);
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onSongsheetStoreChange);
    SettingsStore.addChangeListener(this.onSettingsStoreChange);

    this._init(this.props);
  }

  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onSongsheetStoreChange);
    SettingsStore.removeChangeListener(this.onSettingsStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.signature !== nextProps.params.signature) {
      this._update(nextProps);
    }
  }

  _init(props) {
    if (!this.state.file) {
      this.setState({
        loading: true
      });
      SongsheetService.loadItem(props.params.signature);
    }

    if (this.state.similarSongsheets.length <= 0 || this.state.similarMetadata.length <= 0) {
      SongsheetService.loadSimilar(props.params.signature);
    }
  }

  _update(props) {
    this.setState({
      loading: true
    });
    SongsheetService.loadItem(props.params.signature);
    SongsheetService.loadSimilar(props.params.signature);
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

  onSettingsStoreChange() {
    this.setState({
      similarityThreshold: SettingsStore.settings['threshold'].value
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
          <div className="text">{metadata.text}</div>
        );
      }
    }
  }

  _getAbcViewer(file) {
    if (typeof file !== 'undefined') {
      let abc = json2abc(JSON.stringify(file.json));
      return (
        <AbcViewer abc={abc} itemKey={0} player={true} />
      );
    }
  }

  _getMetadataViewer(metadata) {
    if (typeof metadata !== 'undefined') {
      return (
        <MetadataViewer metadata={metadata} />
      );
    }
  }

  _getSimilarSongsheets(similarityThreshold, similarityScores, similarSongsheets, similarMetadata) {
    let similarItems = similarSongsheets.filter((item) => {
      let similarityScore = similarityScores.find((score) => {
        return score.signature === item.signature;
      });
      if (typeof similarityScore !== 'undefined') {
        return similarityScore.distance >= similarityThreshold;
      } else {
        return false;
      }
    });

    if (similarItems.length > 0) {
      return (
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2 text-center">
            <h3>Ähnliche Liedblätter</h3>
            <FileGrid files={similarItems} metadata={similarMetadata}
                      itemClass="item col-xs-6 col-sm-3 text-center"/>
          </div>
        </div>
      );
    }
  }

  render() {
    let signature = this.props.params.signature;
    let {
      loading,
      metadata,
      file,
      similarityThreshold,
      similarityScores,
      similarSongsheets,
      similarMetadata,
      searchResults
    } = this.state;

    console.log(searchResults);

    let title = typeof metadata !== 'undefined' ? ' - ' + metadata.title : '';

    return (
      <DocumentTitle title={`Liedblatt - ${signature} // ${APP_NAME}`}>
        <div className="songsheet-view">
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

          <div className="row">
            <div className="col-xs-12">
              <h1 className="text-center">{`${signature}${title}`}</h1>
            </div>
            <div className="col-xs-12 col-md-4">
              <div className="row">
                { this._getImageView(metadata) }
              </div>
            </div>
            <div className="col-xs-12 col-md-7 col-md-offset-1">
              { this._getAbcViewer(file) }
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-4">
              <h2>Liedtext</h2>
              { this._getMetadataText(metadata) }
            </div>
            <div className="col-xs-12 col-md-7 col-md-offset-1">
              <h2>Metadaten</h2>
              { this._getMetadataViewer(metadata) }
            </div>
          </div>

          { this._getSimilarSongsheets(similarityThreshold, similarityScores, similarSongsheets, similarMetadata) }
        </div>
      </DocumentTitle>
    );
  }
}