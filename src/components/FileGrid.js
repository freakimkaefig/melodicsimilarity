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
      signature: PropTypes.string,
      title: PropTypes.string,
      image: PropTypes.image,
    })).isRequired
  };

  constructor(props) {
    super(props);
  }

  renderSongsheetGrid(songsheets) {
    if (songsheets.length > 0) {
      return songsheets.map((songsheet, index) => {
        return (
          <div className="col-xs-6 col-sm-4 text-center" key={index}>
            <Link to={`/songsheets/${songsheet.signature}`}>
              <img className="img-responsive" src={songsheet.image}/>
              <h4>{songsheet.signature}</h4>
              <h5>{songsheet.title}</h5>
            </Link>
          </div>
        );
      });
    } else {
      return (
        <div className="loading text-center">
          <span className="fa fa-circle-o-notch fa-spin"></span>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="row">
        { this.renderSongsheetGrid(this.props.files) }
      </div>
    );
  }
}