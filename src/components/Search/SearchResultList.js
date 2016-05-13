import React, { PropTypes } from 'react';
import {Link} from 'react-router';

import '../../stylesheets/Accordion.less';
import '../../stylesheets/SearchResultList.less';

export default class SearchResultList extends React.Component {

  static propTypes = {
    results: PropTypes.arrayOf(PropTypes.object).isRequired,
    highlighting: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  _getList(results) {
    return results.map((result, index) => {
      let highlighting = typeof this.props.highlighting[result.id] !== 'undefined'
        ? this.props.highlighting[result.id].text[0]
        : 'Kein Ausschnitt gefunden';
      return (
        <div className="rc-collapse-item search-result-item" key={index}>
          <div className="rc-collapse-header">
            <div className="header">
              <Link to={`/songsheets/${result.signature}`}>
                <div className="col-xs-3">Image</div>
                <div className="col-xs-9">
                  <h3>{result.signature} - {result.title}</h3>
                  <div className="highlighting" dangerouslySetInnerHTML={{__html: highlighting}} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="rc-collapse">
        { this._getList(this.props.results) }
      </div>
    );
  }
}