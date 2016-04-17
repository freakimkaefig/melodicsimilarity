import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import SongsheetService from '../services/SongsheetService';
import SongsheetStore from '../stores/SongsheetStore';
import ImageZoom from '../components/ImageZoom';
import AbcViewer from '../components/AbcViewer';


export default class SongsheetView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      abc: '',
      image: ''
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    let songsheet = SongsheetStore.songsheets.find(songsheet => {
      return songsheet.signature === this.props.params.signature;
    });
    if (songsheet) {
      this.setState({
        abc: songsheet.abc,
        image: songsheet.image
      });
    } else {
      SongsheetService.loadItem(this.props.params.signature);
    }
  }

  componentDidMount() {
    SongsheetStore.addChangeListener(this.onStoreChange);
  }
  componentWillUnmount() {
    SongsheetStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({
      abc: SongsheetStore.songsheet.abc,
      image: SongsheetStore.songsheet.image
    });
  }

  render() {
    
    return (
      <DocumentTitle title={`Liedblatt // MusicIR`}>
        <div className="row">
          <div className="col-xs-12">
            <h1>Songsheet View</h1>
          </div>

          <div className="col-xs-12 col-sm-4">
            <ImageZoom image={this.state.image} />
          </div>
          <div className="col-xs-12 col-sm-8">
            <AbcViewer abc={this.state.abc} itemKey={0} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}