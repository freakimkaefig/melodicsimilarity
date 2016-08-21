import React, { PropTypes } from 'react';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import ImageZoom from '../components/ImageZoom';
import { json2abc } from 'musicjson2abc';
import AbcViewer from '../components/AbcViewer';
import MetadataViewer from '../components/MetadataViewer';
import FileGrid from '../components/FileGrid';
import SettingsStore from '../stores/SettingsStore';
import '../stylesheets/SongsheetView.less';

export default class SongsheetView extends React.Component {

  static propTypes = {
    file: PropTypes.object,
    metadata: PropTypes.object,
    similarityScores: PropTypes.arrayOf(PropTypes.object),
    similarSongsheets: PropTypes.arrayOf(PropTypes.object),
    similarMetadata: PropTypes.arrayOf(PropTypes.object),
    highlighting: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);

    this.state = {
      similarityThreshold: SettingsStore.settings['threshold'].value
    };

    this.onSettingsStoreChange = this.onSettingsStoreChange.bind(this);
  }

  componentDidMount() {
    SettingsStore.addChangeListener(this.onSettingsStoreChange);
  }

  componentWillUnmount() {
    SettingsStore.removeChangeListener(this.onSettingsStoreChange);
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
    let {
      file,
      metadata,
      similarityScores,
      similarSongsheets,
      similarMetadata,
      highlighting
    } = this.props;

    let {
      similarityThreshold
    } = this.state;

    let signature = typeof file !== 'undefined' ? file.signature : '';
    let title = typeof metadata !== 'undefined' ? ' - ' + metadata.title : '';

    return (
      <div className="songsheet-view">

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
    );
  }
}