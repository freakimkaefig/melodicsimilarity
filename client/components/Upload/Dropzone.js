import React, { PropTypes } from 'react';
import '../../stylesheets/Dropzone.less';

export default class Dropzone extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onDropzoneDrop: PropTypes.func.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    message: PropTypes.string
  };

  createFileList(files) {
    if (files.length > 0) {
      return files.map((file, index) => {
        let stored = file.store === true ? 'success' : 'primary';
        return (
          <span className={`item label label-${stored}`} key={index}>{file.name}</span>
        );
      });
    } else {
      return 'Dateien hier ablegen';
    }
  }

  handleDropzoneDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  handleDropzoneClick(event) {
    event.stopPropagation();
    event.preventDefault();
    var input = document.getElementById(this.props.id);
    var click = new Event('click');
    input.dispatchEvent(click);
  }

  handleInputChange(event) {
    var files = event.target.files;
    this.props.onInputChange(files);
  }

  handleDropzoneDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.dataTransfer.files;
    this.props.onDropzoneDrop(files);
  }

  render() {
    return (
      <div>
        <div className="dropzone-wrapper">
          <input
            type="file"
            name={this.props.id}
            id={this.props.id}
            onChange={this.handleInputChange.bind(this)}
            multiple />
          <div
            id="image-dropzone"
            className="dropzone"
            onDragOver={this.handleDropzoneDragOver.bind(this)}
            onClick={this.handleDropzoneClick.bind(this)}
            onDrop={this.handleDropzoneDrop.bind(this)}>
            {this.createFileList(this.props.files)}
          </div>
        </div>
        <p className={`dropzone-messages text-center text-${this.props.status}`}>{this.props.message}</p>
      </div>
    )
  }
}