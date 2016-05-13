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

  _getResultHighlight(result, highlighting) {
    let highlightItem = highlighting[result.id];
    if (Object.keys(highlightItem).length === 0 && highlightItem.constructor === Object) {
      return (
        <div>{result.text}</div>
      );
    } else {
      var array = [];
      for (var field in highlightItem) {
        if (!highlightItem.hasOwnProperty(field)) continue;
        console.log(field, highlightItem[field]);
        array.push(highlightItem[field]);
      }

      return array.map((field, index) => {
        return(
          <div key={index} dangerouslySetInnerHTML={{__html: field}} />
        );
      });
    }
  }

  _getList(results) {
    return results.map((result, index) => {
      return (
        <div className="rc-collapse-item search-result-item" key={index}>
          <div className="rc-collapse-header">
            <div className="header">
              <Link to={`/songsheets/${result.signature}`}>
                <div className="hidden-xs col-sm-3 col-md-2">
                  <img src={ result.image } className="img-responsive" />
                </div>
                <div className="col-xs-12 col-sm-8 col-sm-offset-1 col-md-7">
                  <h3>{result.signature} - {result.title}</h3>
                  <div className="highlighting">
                    { this._getResultHighlight(result, this.props.highlighting) }
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )
    });
  }

  render() {
    return (
      <div className="rc-collapse">
        { this._getList(this.props.results) }
      </div>
    );
  }
}