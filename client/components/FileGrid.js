import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import '../stylesheets/FileGrid.less';

export default class FileGrid extends React.Component {

  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      abc: PropTypes.string,
      json: PropTypes.object,
      name: PropTypes.string,
      signature: PropTypes.string.isRequired
    })).isRequired,
    metadata: PropTypes.array,
    itemClass: PropTypes.string
  };

  static defaultProps = {
    itemClass: 'item col-xs-6 col-sm-3 col-lg-2 text-center'
  };

  constructor(props) {
    super(props);
  }

  renderFileGrid(files, metadata, itemClass) {
    if (files.length > 0) {
      return files.map((file, index) => {
        let data = metadata.find(item => {
          return item.signature == file.signature;
        });

        let title = 'Kein Incipit vorhanden';
        let imagename = 'placeholder.jpg';
        if (typeof data !== 'undefined') {
          if (typeof data.title !== 'undefined') {
            title = data.title;
          }
          if (typeof data.imagename !== 'undefined') {
            imagename = data.imagename;
          }
        }

        return (
          <div className={itemClass} key={index}>
            <Link to={`/songsheets/${file.signature}`}>
              <img className="img-responsive" src={METADATA_IMAGE_BASE_URL + imagename}/>
              <h4>{file.signature}</h4>
              <h5>{title}</h5>
            </Link>
          </div>
        );
      });
    }
  }

  render() {
    let {files, metadata, itemClass} = this.props;
    return (
      <div className="grid row start-xs">
        { this.renderFileGrid(files, metadata, itemClass) }
      </div>
    );
  }
}