import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import '../stylesheets/FileGrid.less';

export default class FileGrid extends React.Component {

  static propTypes = {
    songsheets: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      json: PropTypes.object,
      name: PropTypes.string,
      signature: PropTypes.string.isRequired
    })).isRequired,
    itemClass: PropTypes.string
  };

  static defaultProps = {
    itemClass: 'item col-xs-6 col-sm-3 col-lg-2 text-center'
  };

  constructor(props) {
    super(props);
  }

  renderFileGrid(songsheets, itemClass) {
    if (songsheets.length > 0) {
      return songsheets.map((item, index) => {
        return (
          <div className={itemClass} key={index}>
            <Link to={`/songsheets/${item.signature}`}>
              <img className="img-responsive" src={METADATA_IMAGE_BASE_URL + item.imagename}/>
              <h4>{item.signature}</h4>
              <h5>{item.title}</h5>
            </Link>
          </div>
        );
      });
    }
  }

  render() {
    let {
      songsheets,
      itemClass
    } = this.props;

    return (
      <div className="grid row start-xs">
        { this.renderFileGrid(songsheets, itemClass) }
      </div>
    );
  }
}