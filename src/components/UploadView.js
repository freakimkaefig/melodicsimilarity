import React, { PropTypes } from 'react';
import Dropzone from './Dropzone';
import { convert2Abc } from 'musicjson2abc';
import UploadActions from '../actions/UploadActions';
import UploadStore from '../stores/UploadStore';

export default class UploadView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: {
        files: [],
        counter: 0
      },
      jsons: {
        files: [],
        counter: 0
      },
      files: []
    };

    this.onImageInputChange = this.onImageInputChange.bind(this);
    this.onImageDropzoneDrop = this.onImageDropzoneDrop.bind(this);
    this.saveImageFiles = this.saveImageFiles.bind(this);

    this.onJsonInputChange = this.onJsonInputChange.bind(this);
    this.onJsonDropzoneDrop = this.onJsonDropzoneDrop.bind(this);
    this.saveJsonFiles = this.saveJsonFiles.bind(this);
    
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    UploadStore.addChangeListener(this.onStoreChange);
  }
  componentWillUnmount() {
    UploadStore.removeChangeListener(this.onStoreChange);
  }

  onImageInputChange(files) {
    this.saveImageFiles(files);
  }
  onImageDropzoneDrop(files) {
    this.saveImageFiles(files);
  }
  saveImageFiles(files) {
    console.log(files);
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      if (f.type !== 'image/png') continue;

      reader.readAsDataURL(f);
      reader.onload = (function(theFile) {
        return function(e) {
          var content = e.target.result;

          this.setState({
            images: {
              files: this.state.images.files.concat({
                clearName: theFile.name.replace(/\.[^/.]+$/, ''),
                image: content
              }),
              counter: this.state.images.counter + 1
            }
          });

          UploadActions.saveImageFiles(this.state.images.files);
        }
      })(f).bind(this);
    }
  }

  onJsonInputChange(event) {
    this.saveJsonFiles(event.target.files);
  }
  onJsonDropzoneDrop(files) {
    
    this.saveJsonFiles(files);
  }
  saveJsonFiles(files) {
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      if (f.type === 'image/png') {
        continue;
      }
      reader.readAsText(f);
      reader.onload = (function(theFile) {
        return function(e) {
          var content = e.target.result;

          this.setState({
            jsons: {
              files: this.state.jsons.files.concat({
                key: this.state.jsons.counter + 1,
                name: theFile.name,
                clearName: theFile.name.replace(/\.[^/.]+$/, ''),
                store: false,
                upload: true,
                content: JSON.parse(content),
                abc: convert2Abc(content)
              }),
              counter: this.state.jsons.counter + 1
            }
          });

          UploadActions.saveJsonFiles(this.state.jsons.files);
        }
      })(f).bind(this);
    }
  }

  onStoreChange() {
    console.log(UploadStore.files, UploadStore.jsons, UploadStore.images);
    this.setState({
      images: {
        files: UploadStore.images
      },
      jsons: {
        files: UploadStore.jsons
      },
      files: UploadStore.files
    })
  }

  render() {
    return (
      <div>
        <hr/>
        <div className="row">
          <div className="col-xs-12">
            Hier können die Liedblatt-Daten hochgeladen werden. Beim Upload werden die Bildateien den JSON-Dateien zugeordnet anhand des Dateinamens. Zusammengehörige Dateien sollten also den selben Dateinamen (ohne die Endung) haben.
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <h3>Schritt 1: Transkribierte Liedblatt-Dateien</h3>
            <div><span>Counter: </span><span>{ this.state.jsons.counter }</span></div>
            <Dropzone
              id="json-files"
              onInputChange={this.onJsonInputChange}
              onDropzoneDrop={this.onJsonDropzoneDrop}
              files={this.state.jsons.files}
            />
          </div>

          <div className="col-xs-12 col-sm-6">
            <h3>Schritt 2: Gescannte Liedblatt-Dateien</h3>
            <div><span>Counter: </span><span>{ this.state.images.counter }</span></div>
            <Dropzone
              id="image-files"
              onInputChange={this.onImageInputChange}
              onDropzoneDrop={this.onImageDropzoneDrop}
              files={this.state.images.files}
            />
          </div>
        </div>
      </div>
    );
  }
}