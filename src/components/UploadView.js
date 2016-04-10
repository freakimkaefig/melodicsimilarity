import React, { PropTypes } from 'react';
import Dropzone from './Dropzone';
import { convert2Abc } from 'musicjson2abc';
import UploadActions from '../actions/UploadActions';
import UploadStore from '../stores/UploadStore';
import FileList from './FileList';

export default class UploadView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      imageFiles: [],
      imageCounter: 0,
      imageMessage: 'Dateien hierher ziehen oder klicken zum auswählen.',
      imageStatus: 'muted',
      jsonFiles: [],
      jsonCounter: 0,
      jsonMessage: 'Dateien hierher ziehen oder klicken zum auswählen.',
      jsonStatus: 'muted'
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

      if (f.name.split('.').pop() !== 'png' && f.name.split('.').pop() !== 'jpg') {
        this.setState({
          imageMessage: 'Hier können nur png oder jpg Dateien hochgeladen werden.',
          imageStatus: 'warning'
        });
        continue;
      }

      reader.readAsDataURL(f);
      reader.onload = (function(theFile) {
        return function(e) {
          var content = e.target.result;

          this.setState({
            imageFiles: this.state.imageFiles.concat({
              clearName: theFile.name.replace(/\.[^/.]+$/, ''),
              image: content
            }),
            imageCounter: this.state.imageCounter + 1,
            imageMessage: 'Dateien hinzugefügt',
            imageStatus: 'success'
          });

          UploadActions.saveImageFiles(this.state.imageFiles);
        }
      })(f).bind(this);
    }
  }

  onJsonInputChange(files) {
    this.saveJsonFiles(files);
  }
  onJsonDropzoneDrop(files) {
    
    this.saveJsonFiles(files);
  }
  saveJsonFiles(files) {
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

      if (f.name.split('.').pop() !== 'json') {
        this.setState({
          jsonMessage: 'Hier können nur JSON Dateien hochgeladen werden.',
          jsonStatus: 'warning'
        });
        continue;
      }
      reader.readAsText(f);
      reader.onload = (function(theFile) {
        return function(e) {
          var content = e.target.result;

          this.setState({
            jsonFiles: this.state.jsonFiles.concat({
              key: this.state.jsonCounter + 1,
              name: theFile.name,
              clearName: theFile.name.replace(/\.[^/.]+$/, ''),
              metadata: {},
              store: false,
              upload: true,
              content: JSON.parse(content),
              abc: convert2Abc(content)
            }),
            jsonCounter: this.state.jsonCounter + 1,
            jsonMessage: 'Dateien hinzugefügt',
            jsonStatus: 'success'
          });

          UploadActions.saveJsonFiles(this.state.jsonFiles);
        }
      })(f).bind(this);
    }
  }

  onFileListCheckboxClick(key) {
    return () => {
      let updatedFiles = this.state.files;
      updatedFiles.forEach(f => {
        if (f.key == key) {
          f.upload = !f.upload;
        }
      });
      this.setState({files: updatedFiles});
    }
  }
  onStoreChange() {
    console.log(UploadStore.files, UploadStore.jsons, UploadStore.images);
    this.setState({
      imageFiles: UploadStore.images,
      jsonFiles: UploadStore.jsons,
      files: UploadStore.files
    });
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
            <div className="hidden"><span>Counter: </span><span>{ this.state.jsonCounter }</span></div>
            <Dropzone
              id="json-files"
              onInputChange={this.onJsonInputChange}
              onDropzoneDrop={this.onJsonDropzoneDrop}
              files={this.state.jsonFiles}
              message={this.state.jsonMessage}
              status={this.state.jsonStatus}
            />
          </div>

          <div className="col-xs-12 col-sm-6">
            <h3>Schritt 2: Gescannte Liedblatt-Dateien</h3>
            <div className="hidden"><span>Counter: </span><span>{ this.state.imageCounter }</span></div>
            <Dropzone
              id="image-files"
              onInputChange={this.onImageInputChange}
              onDropzoneDrop={this.onImageDropzoneDrop}
              files={this.state.imageFiles}
              message={this.state.imageMessage}
              status={this.state.imageStatus}
            />
          </div>
        </div>
        
        <div className="row">
          <div className="col-xs-12">
            <FileList files={this.state.files} onCheckboxClick={this.onFileListCheckboxClick} />
          </div>
        </div>
      </div>
    );
  }
}