import React from 'react';
import _ from 'lodash';
import UploadStore from '../stores/UploadStore';
import Collapse from './Accordion/index';
import AbcViewer from './AbcViewer';

require('../stylesheets/FileList.less');

export default class FileList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files: []
    };

    this.onFilesChange = this.onFilesChange.bind(this);
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
  }

  componentDidMount() {
    UploadStore.addChangeListener(this.onFilesChange);
  }

  componentWillUnmount() {
    UploadStore.removeChangeListener(this.onFilesChange);
  }

  onFilesChange() {
    this.setState({files: UploadStore.files});
  }

  onCheckboxClick(key) {
    return () => {
      let updatedFiles = this.state.files;
      updatedFiles.find(function(f) {
        return f.key == key;
      })
      .upload = !updatedFiles.find(function(f) {
        return f.key == key;
      }).upload;

      this.setState({files: updatedFiles});
    }
  }

  createFileList(files) {
    return files.filter(file => {
        return _.has(file, 'key') && _.has(file, 'name');
      }).map(file => {
        return (
          <Collapse.Panel
            key={file.key}
            header={file.name}
            checkbox={file.upload}
            onCheckboxClick={this.onCheckboxClick}>
            <div className="col-xs-4">
              <img src={file.image} className="img-responsive" />
            </div>
            <div className="col-xs-4">
              <AbcViewer itemKey={file.key} abc={file.abc} />
            </div>
          </Collapse.Panel>
        );
      });
  }

  render() {
    return (
      <Collapse accordion={true}>
        { this.createFileList(this.state.files) }
      </Collapse>
    );
  }
}