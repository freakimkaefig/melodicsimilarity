import React, { PropTypes } from 'react';
import Dropzone from './Dropzone';
import Collapse from '../Accordion/index';
import AbcViewer from '../AbcViewer';
import MetadataViewer from '../MetadataViewer';
import _ from 'lodash';
import { json2abc } from 'musicjson2abc';
import UploadActions from '../../actions/UploadActions';
import UploadStore from '../../stores/UploadStore';
import FileList from '../FileAccordion';
import { Button } from 'react-bootstrap';
import ImageZoom from '../ImageZoom';
import UploadService from '../../services/UploadService';
import { browserHistory } from 'react-router';
import { UPLOAD_CONTEXT } from '../../constants/UploadConstants';
import { METADATA_IMAGE_BASE_URL, METADATA_PLACEHOLDER_IMAGE, METADATA_PLACEHOLDER_TITLE, METADATA_PLACEHOLDER_TEXT } from '../../constants/SolrConstants';
import '../../stylesheets/UploadView.less';
import SolrService from '../../services/SolrService';

export default class UploadView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      metadata: [],
      counter: 0,
      message: 'Dateien hierher ziehen oder klicken zum auswählen.',
      status: 'muted',
      uploadAllowed: true
    };

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
          message: 'Hier können nur JSON Dateien hochgeladen werden.',
          status: 'warning'
        });
        continue;
      }
      reader.readAsText(f);
      reader.onload = (function(theFile) {
        return function(e) {
          var content = e.target.result;
          var abc = json2abc(content);
          var json = JSON.parse(content);
          var updatedFiles = this.state.files.concat({
            key: this.state.counter + 1,
            name: theFile.name,
            store: false,
            upload: true,
            metadata: {

            },
            signature: json.id,
            json: json,
            abc: abc
          });

          var updatedMetadata = this.state.metadata.concat({
            signature: json.id,
            imagename: METADATA_PLACEHOLDER_IMAGE,
            title: METADATA_PLACEHOLDER_TITLE,
            text: METADATA_PLACEHOLDER_TEXT,
            loaded: false
          });

          UploadActions.saveFiles(updatedFiles, updatedMetadata);
        }
      })(f).bind(this);
    }
  }

  fileListRenderFunction(props) {
    return props.files.filter(file => {
      return _.has(file, 'key') && _.has(file, 'name');
    }).map(file => {
      let signature = file.signature;

      let metadata = props.metadata.find(data => {
        return data.signature == signature;
      });

      if (!metadata.loaded) {
        SolrService.findDoc(signature, UPLOAD_CONTEXT);
      }

      let title = 'Kein Incipit vorhanden';
      let text = 'Kein Text vorhanden';
      if (typeof metadata !== 'undefined') {
        if (typeof metadata.title !== 'undefined') title = metadata.title;
        if (typeof metadata.text !== 'undefined') text = metadata.text;
      }

      return (
        <Collapse.Panel
          key={file.key}
          header={`${signature} ${title} (${file.name})`}
          checkbox={file.upload}
          onCheckboxClick={props.onCheckboxClick}>
          <div className="row">
            <div className="col-xs-12 col-md-4">
              <div className="row">
                <div className="col-xs-12 image">
                  <ImageZoom itemKey={file.key} image={METADATA_IMAGE_BASE_URL + metadata.imagename} />
                </div>
                <div className="col-xs-12 text">{text}</div>
              </div>
            </div>
            <div className="col-xs-12 col-md-7 col-md-offset-1">
              <AbcViewer itemKey={file.key} abc={file.abc} player={true} />
              <MetadataViewer metadata={metadata} />
            </div>
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
      uploadFile.signature = f.signature;
      uploadFile.json = f.json;
      uploadFile.json.measures.forEach(m => {
        m.notes.forEach(n => {
          delete n.$$hashKey;
        });
      });
      uploadFile.abc = f.abc;
      uploadFile.name = f.name;
      UploadService.upload(uploadFile);
    });

    this.setState({uploadAllowed: false});

    browserHistory.push('/upload/progress');
  }

  onStoreChange() {
    // TODO: remove logs
    console.log("Files", UploadStore.files);
    console.log("Metadata", UploadStore.metadata);

    this.setState({
      files: UploadStore.files,
      metadata: UploadStore.metadata,
      counter: UploadStore.files.length,
      message: 'Dateien hinzugefügt',
      status: 'success'
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
          <div className="col-xs-12">
            <Dropzone
              id="json-files"
              onInputChange={this.onJsonInputChange}
              onDropzoneDrop={this.onJsonDropzoneDrop}
              files={this.state.files}
              message={this.state.message}
              status={this.state.status}
            />
          </div>
        </div>
        
        <div className="row" id="upload-file-list">
          <div className="col-xs-12">
            <FileList files={this.state.files} metadata={this.state.metadata} renderFunction={this.fileListRenderFunction} onCheckboxClick={this.onFileListCheckboxClick} onChange={this.onFileListChange} />
          </div>
        </div>
        <div className="row" id="upload-button">
          <div className="col-xs-12 text-right">
            <Button bsStyle="default" disabled={!this.countUploadFiles() || !this.state.uploadAllowed} onClick={this.onUploadClick}>
              <span>Upload</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}