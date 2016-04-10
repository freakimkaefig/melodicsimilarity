import React, { PropTypes } from 'react';
import _ from 'lodash';
import UploadStore from '../stores/UploadStore';
import Collapse from './Accordion/index';
import AbcViewer from './AbcViewer';
import MetadataViewer from './MetadataViewer';
import '../stylesheets/FileList.less';

export default class FileList extends React.Component {

  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCheckboxClick: PropTypes.func
  };

  constructor(props) {
    super(props);

    // this.onCheckboxClick = this.onCheckboxClick.bind(this);
  }

  // onCheckboxClick(key) {
  //   return () => {
  //    this.props.onCheckboxClick(key);
  //   }
  // }

  createFileList(files) {
    return files.filter(file => {
        return _.has(file, 'key') && _.has(file, 'name');
      }).map(file => {
        return (
          <Collapse.Panel
            key={file.key}
            header={file.name}
            checkbox={file.upload}
            onCheckboxClick={this.props.onCheckboxClick}>
            <div className="col-xs-5">
              <img src={file.image} className="img-responsive" />
            </div>
            <div className="col-xs-7">
              <AbcViewer itemKey={file.key} abc={file.abc} />
              <MetadataViewer file={file} />
            </div>
          </Collapse.Panel>
        );
      });
  }

  render() {
    return (
      <Collapse accordion={true}>
        { this.createFileList(this.props.files) }
      </Collapse>
    );
  }
}