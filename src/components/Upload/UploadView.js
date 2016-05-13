import React, { PropTypes } from 'react';
import Dropzone from './Dropzone';
import Collapse from '../Accordion/index';
import AbcViewer from '../AbcViewer';
import MetadataViewer from '../MetadataViewer';
import _ from 'lodash';
import { convert2Abc } from 'musicjson2abc';
import UploadActions from '../../actions/UploadActions';
import UploadStore from '../../stores/UploadStore';
import FileList from '../FileAccordion';
import { Button } from 'react-bootstrap';
import ImageZoom from '../ImageZoom';
import UploadService from '../../services/UploadService';
import { browserHistory } from 'react-router';
import { UPLOAD_CONTEXT } from '../../constants/UploadConstants';

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
      jsonStatus: 'muted',
      uploadAllowed: true
    };

    this.onImageInputChange = this.onImageInputChange.bind(this);
    this.onImageDropzoneDrop = this.onImageDropzoneDrop.bind(this);
    this.saveImageFiles = this.saveImageFiles.bind(this);

    this.onJsonInputChange = this.onJsonInputChange.bind(this);
    this.onJsonDropzoneDrop = this.onJsonDropzoneDrop.bind(this);
    this.saveJsonFiles = this.saveJsonFiles.bind(this);

    this.onFileListCheckboxClick = this.onFileListCheckboxClick.bind(this);
    this.onFileListChange = this.onFileListChange.bind(this);

    this.countUploadFiles = this.countUploadFiles.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);

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
              image: content,
              imageName: theFile.name,
              imageType: theFile.type
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
              signature: JSON.parse(content).id,
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

  fileListRenderFunction(props) {
    return props.files.filter(file => {
      return _.has(file, 'key') && _.has(file, 'name');
    }).map(file => {
      let signature = file.signature;
      let title = _.has(file, 'metadata') ? ' ' + file.metadata.title : '';
      return (
        <Collapse.Panel
          key={file.key}
          header={`${signature}${title} (${file.clearName})`}
          checkbox={file.upload}
          onCheckboxClick={props.onCheckboxClick}>
          <div className="col-xs-5">
            <div className="row">
              <div className="col-xs-12 image">
                <ImageZoom itemKey={file.key} image={file.image} store={UploadStore} />
              </div>
              <div className="col-xs-12 text">{file.metadata.text}</div>
            </div>
          </div>
          <div className="col-xs-7">
            <AbcViewer itemKey={file.key} abc={file.abc} />
            <MetadataViewer file={file} context={UPLOAD_CONTEXT} />
          </div>
        </Collapse.Panel>
      );
    });
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

  onFileListChange(key) {
    UploadActions.setListActive(key);
  }

  countUploadFiles() {
    return this.state.files.filter(file => {
      return file.upload === true;
    }).length > 0;
  }

  onUploadClick() {
    let uploadFiles = this.state.files.filter(f => {
      return f.upload;
    });

    uploadFiles.forEach(f => {
      let uploadFile = {};
      uploadFile.abc = f.abc;
      uploadFile.json = f.content;
      uploadFile.json.measures.forEach(m => {
        m.notes.forEach(n => {
          delete n.$$hashKey;
        });
      });
      uploadFile.name = f.name;
      uploadFile.signature = f.metadata.signature;
      uploadFile.title = f.metadata.title;
      uploadFile.image = f.image;
      uploadFile.imageName = f.imageName;
      uploadFile.imageType = f.imageType;
      UploadService.upload(uploadFile);
    });

    this.setState({uploadAllowed: false});

    browserHistory.push('/upload/progress');
  }

  onStoreChange() {
    // TODO: remove logs
    console.log("Images", UploadStore.images);
    console.log("Jsons", UploadStore.jsons);
    console.log("Files", UploadStore.files);
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
            <FileList files={this.state.files} renderFunction={this.fileListRenderFunction} onCheckboxClick={this.onFileListCheckboxClick} onChange={this.onFileListChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Button bsStyle="success" disabled={!this.countUploadFiles() || !this.state.uploadAllowed} onClick={this.onUploadClick}>
              <span>Upload</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}