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
      signature: PropTypes.string.isRequired,
    })).isRequired,
    metadata: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  renderFileGrid(files, metadata) {
    if (files.length > 0) {
      return files.map((file, index) => {
        console.log(metadata);
        let data = metadata.find(item => {
          return item.signature == file.signature;
        });
        return (
          <div className="col-xs-6 col-sm-3 col-lg-2 text-center" key={index}>
            <Link to={`/songsheets/${file.signature}`}>
              <img className="img-responsive" src={METADATA_IMAGE_BASE_URL + data.imagename}/>
              <h4>{file.signature}</h4>
              <h5>{data.title}</h5>
            </Link>
          </div>
        );
      });
    }
  }

  render() {
    return (
      <div className="row">
        { this.renderFileGrid(this.props.files, this.props.metadata) }
      </div>
    );
  }
}