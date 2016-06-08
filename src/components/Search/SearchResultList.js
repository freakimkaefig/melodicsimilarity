import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import {METADATA_IMAGE_BASE_URL} from '../../constants/SolrConstants';
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

  _getContainer(result) {
    console.log(result);
    let resultHtml = (
      <div className="row">
        <div className="hidden-xs col-sm-3 col-md-2">
          <img src={ METADATA_IMAGE_BASE_URL + result.metadata.imagename } className="img-responsive" />
        </div>
        <div className="col-xs-12 col-sm-8 col-sm-offset-1 col-md-7">
          <h3>{ this._getResultHeadline(result) }</h3>
          <div className="highlighting">
            { this._getResultHighlight(result) }
          </div>
        </div>
      </div>
    );

    if (result.url) {
      return (
        <Link to={result.url}>
          { resultHtml }
        </Link>
      );
    }
  }

  _getResultHeadline(result) {
    let title = '';
    if (result.id !== null) {
      title += result.id + ' - ';
    }

    title += result.metadata.title;

    return title;
  }

  _getResultHighlight(result) {
    let highlightItem = result.highlighting;
    if (typeof highlightItem !== 'undefined') {
      if (Object.keys(highlightItem).length === 0 && highlightItem.constructor === Object) {
        return (
          <div>Kein Ausschnitt vorhanden.</div>
        );
      } else {
        var array = [];
        for (var field in highlightItem.fields) {
          if (!highlightItem.fields.hasOwnProperty(field)) continue;
          array.push(highlightItem.fields[field]);
        }

        return array.map((field, index) => {
          return (
            <div key={index} dangerouslySetInnerHTML={{__html: field}}/>
          );
        });
      }
    }
  }

  _getList(results) {
    console.log("List results:", results);
    return results.map((result, index) => {
      if (result !== false) {
        return (
          <div className="rc-collapse-item search-result-item" key={index}>
            <div className="rc-collapse-header">
              <div className="header">
                { this._getContainer(result) }
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