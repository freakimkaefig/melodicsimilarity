import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import { METADATA_IMAGE_BASE_URL } from '../constants/SolrConstants';
import { THUMBNAIL_PREFIX } from '../constants/SongsheetConstants';
import '../stylesheets/FileGrid.less';

export default class FileGrid extends React.Component {

  static propTypes = {
    songsheets: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      json: PropTypes.object,
      name: PropTypes.string,
      signature: PropTypes.string.isRequired
    })).isRequired,
    urlPrefix: PropTypes.string,
    itemClass: PropTypes.string,
    customField: PropTypes.element
  };

  static defaultProps = {
    itemClass: 'item col-xs-6 col-sm-3 col-lg-2 text-center'
  };

  constructor(props) {
    super(props);
  }

  renderFileGrid(songsheets, urlPrefix, itemClass, customField) {
    if (songsheets.length > 0) {
      return songsheets.map((item, index) => {
        return (
          <div className={itemClass} key={index} data-signature={item.signature}>
            <Link to={`${urlPrefix}${item.signature}`}>
              <img className="img-responsive" src={METADATA_IMAGE_BASE_URL + THUMBNAIL_PREFIX + item.imagename}/>
              <h4>{item.signature}</h4>
              <h5>{item.title}</h5>
            </Link>
            {customField}
          </div>
        );
      });
    }
  }

  render() {
    let {
      songsheets,
      urlPrefix,
      itemClass,
      customField
    } = this.props;

    return (
      <div className="grid row start-xs">
        { this.renderFileGrid(songsheets, urlPrefix, itemClass, customField) }
      </div>
    );
  }
}