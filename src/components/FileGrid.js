import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import '../stylesheets/FileGrid.less';

export default class FileGrid extends React.Component {

  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      abc: PropTypes.string,
      json: PropTypes.object,
      name: PropTypes.string,
      signature: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired
    })).isRequired
  };

  constructor(props) {
    super(props);
  }

  renderFileGrid(files) {
    if (files.length > 0) {
      return files.map((file, index) => {
        return (
          <div className="col-xs-6 col-sm-3 col-lg-2 text-center" key={index}>
            <Link to={`/songsheets/${file.signature}`}>
              <img className="img-responsive" src={file.image}/>
              <h4>{file.signature}</h4>
              <h5>{file.title}</h5>
            </Link>
          </div>
        );
      });
    }
  }

  render() {
    return (
      <div className="row">
        { this.renderFileGrid(this.props.files) }
      </div>
    );
  }
}