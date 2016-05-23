import React, { PropTypes } from 'react';
import {Link} from 'react-router';

import '../../stylesheets/Accordion.less';
import '../../stylesheets/SearchResultList.less';

export default class SearchResultList extends React.Component {

  static propTypes = {
    results: PropTypes.array.isRequired,
    highlighting: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  _getContainer(result, highlighting) {
    if (typeof result.signature !== 'undefined') {
      return (
        <Link to={`/songsheets/${result.signature}`}>
          <div className="row">
            <div className="hidden-xs col-sm-3 col-md-2">
              <img src={ result.image } className="img-responsive" />
            </div>
            <div className="col-xs-12 col-sm-8 col-sm-offset-1 col-md-7">
              <h3>{ this._getResultHeadline(result) }</h3>
              <div className="highlighting">
                { this._getResultHighlight(result, highlighting) }
              </div>
            </div>
          </div>
        </Link>
      );
    } else {
      return (
        <div className="row">
          <div className="hidden-xs col-sm-3 col-md-2">
            <img src={`http://localhost:8080/SolrInteractionServer/FrontEnd/img/jpegs/${result.imagename}`} className="img-responsive" />
          </div>
          <div className="col-xs-12 col-sm-8 col-sm-offset-1 col-md-7">
            <h3>{ this._getResultHeadline(result) }</h3>
            <div className="highlighting">
              { this._getResultHighlight(result, highlighting) }
            </div>
          </div>
        </div>
      );
    }
  }

  _getResultHeadline(result) {
    let ret = ''
    if (typeof result.signature !== 'undefined') {
      ret += result.signature + ' - ';
    }
    if (typeof result.title !== 'undefined') {
      ret += result.title;
    } else {
      ret += 'Kein Incipit vorhanden';
    }

    return ret;
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
      if (result !== false) {
        return (
          <div className="rc-collapse-item search-result-item" key={index}>
            <div className="rc-collapse-header">
              <div className="header">
                { this._getContainer(result, this.props.highlighting) }
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="rc-collapse-item search-result-item" key={index}>
            <div className="rc-collapse-header">
              <div className="header">
                <h3 className="text-center">Für deine Suchanfrage konnten keine Ergebnisse gefunden werden.</h3>
              </div>
            </div>
          </div>
        );
      }
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