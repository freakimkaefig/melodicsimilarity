import React, { PropTypes } from 'react';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import ImageZoom from '../components/ImageZoom';
import { json2abc } from 'musicjson2abc';
import AbcViewer from '../components/AbcViewer';
import { Table } from 'react-bootstrap';
import MetadataViewer from '../components/MetadataViewer';
import FileGrid from '../components/FileGrid';
import SettingsStore from '../stores/SettingsStore';
import '../stylesheets/SongsheetView.less';

export default class SongsheetView extends React.Component {

  static propTypes = {
    songsheet: PropTypes.object,
    songsheets: PropTypes.arrayOf(PropTypes.object),
    similarityScores: PropTypes.arrayOf(PropTypes.object),
    melodicHighlighting: PropTypes.arrayOf(PropTypes.object),
    metadataHighlighting: PropTypes.arrayOf(PropTypes.object)
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

  _getImageView(songsheet) {
    if (typeof songsheet !== 'undefined') {
      if (typeof songsheet.imagename !== 'undefined') {
        return (
          <ImageZoom itemKey={0} image={METADATA_IMAGE_BASE_URL + songsheet.imagename} />
        );
      }
    }
  }

  _getMetadataText(songsheet) {
    if (typeof songsheet !== 'undefined') {
      if (typeof songsheet.text !== 'undefined') {
        return (
          <div className="text">{songsheet.text}</div>
        );
      }
    }
  }

  _getAbcViewer(songsheet, highlighting) {
    if (typeof songsheet !== 'undefined') {
      if (typeof songsheet.json !== 'undefined') {
        let abc = json2abc(songsheet.json);
        return (
          <AbcViewer abc={abc} itemKey={0} player={true} highlight={highlighting}/>
        );
      }
    }
  }

  _getJsonDownload(songsheet) {
    if (typeof songsheet !== 'undefined') {
      return (
        <div className="download-container">
          <a download={`${songsheet.signature}.json`} href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(songsheet.json, null, 4))}`}>download json</a>
        </div>
      );
    }
  }

  _getResultStats(highlighting) {
    if (typeof highlighting !== 'undefined') {
      if (highlighting.length > 0) {

        let rows = highlighting.map((item, index) => {
          let start = item.highlight[0].measure + 1;
          let end = item.highlight[item.highlight.length - 1].measure + 1;
          let measures = start === end ? 'Takt ' + start : 'Takte ' + start + '-' + end;
          return (
            <tr key={index}>
              <td>{measures}</td>
              <td>{item.similarity}</td>
            </tr>
          );
        });

        return (
          <div className="stats">
            <h4>Trefferübersicht</h4>
            <Table responsive>
              <thead>
              <tr>
                <td>Takte</td>
                <td>Melodic Similarity</td>
              </tr>
              </thead>
              <tbody>
              {rows}
              </tbody>
            </Table>
          </div>
        );
      }
    }
  }

  _getMetadataViewer(songsheet, highlighting) {
    if (typeof songsheet !== 'undefined') {
      return (
        <MetadataViewer metadata={songsheet} highlight={highlighting} />
      );
    }
  }

  _getSimilarSongsheets(similarityThreshold, similarityScores, songsheets) {
    if (typeof songsheets !== 'undefined') {
      let similarItems = songsheets.filter((item) => {
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
            <div className="col-xs-12 col-lg-8 col-lg-offset-2 text-center">
              <div className="box">
                <div className="heading row">
                  <div className="col-xs-12">
                    <h3>Ähnliche Liedblätter</h3>
                  </div>
                </div>
                <div className="content row">
                  <div className="col-xs-12">
                    <FileGrid songsheets={similarItems.slice(0, 4)} urlPrefix="/songsheets/"
                              itemClass="item col-xs-6 col-sm-3 text-center"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  render() {
    let {
      songsheet,
      songsheets,
      similarityScores,
      melodicHighlighting,
      metadataHighlighting
    } = this.props;

    let {
      similarityThreshold
    } = this.state;

    let signature = typeof songsheet !== 'undefined' ? songsheet.signature : '';
    let title = typeof songsheet !== 'undefined' ? ' - ' + songsheet.title : '';

    return (
      <div className="songsheet-view">

        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="heading row">
                <div className="col-xs-12">
                  <h1 className="text-center">{`${signature}${title}`}</h1>
                </div>
              </div>
              <div className="content row">
                <div className="col-xs-12 col-md-5">
                  { this._getImageView(songsheet) }
                </div>
                <div className="col-xs-12 col-md-6 col-md-offset-1">
                  { this._getAbcViewer(songsheet, melodicHighlighting) }
                  { this._getJsonDownload(songsheet) }
                  { this._getResultStats(melodicHighlighting) }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-6">
            <div className="box">
              <div className="heading row">
                <div className="col-xs-12">
                  <h2 className="text-center">Liedtext</h2>
                </div>
              </div>
              <div className="content row">
                <div className="col-xs-12">
                  { this._getMetadataText(songsheet) }
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="box">
              <div className="heading row">
                <div className="col-xs-12">
                  <h2 className="text-center">Metadaten</h2>
                </div>
              </div>
              <div className="content row">
                <div className="col-xs-12">
                  { this._getMetadataViewer(songsheet, metadataHighlighting) }
                </div>
              </div>
            </div>
          </div>
        </div>

        { this._getSimilarSongsheets(similarityThreshold, similarityScores, songsheets) }

      </div>
    );
  }
}