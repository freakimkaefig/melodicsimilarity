import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import {METADATA_IMAGE_BASE_URL} from '../../constants/SolrConstants';
import { json2abc } from 'musicjson2abc';
import AbcViewer from '../AbcViewer';
import '../../stylesheets/SearchResultList.less';

export default class SearchResultList extends React.Component {

  static propTypes = {
    results: PropTypes.array.isRequired,
    highlighting: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  _getContainer(result, index) {
    console.log(result);
    
    let headline = '';
    let image = '';
    if (result.url) {
      headline = (
        <Link to={result.url}>
          <h3>{ this._getResultHeadline(result) }</h3>
        </Link>
      );
      image = (
        <Link to={result.url}>
          <img src={ METADATA_IMAGE_BASE_URL + result.metadata.imagename } className="img-responsive" />
        </Link>
      );
    } else {
      headline = (
        <h3>{ this._getResultHeadline(result) }</h3>
      );
      image = (
        <img src={ METADATA_IMAGE_BASE_URL + result.metadata.imagename } className="img-responsive" />
      );
    }

    return (
      <div className="row">
        <div className="hidden-xs col-sm-3 col-md-2">
          { image }
        </div>
        <div className="col-xs-12 col-sm-8 col-sm-offset-1 col-md-7">
          { headline }
          <div className="highlighting">
            { this._getResultHighlight(result, index) }
          </div>
        </div>
      </div>
    );
  }

  _getResultHeadline(result) {
    let title = '';
    if (result.id !== null) {
      title += result.id + ' - ';
    }

    title += result.metadata.title;

    return title;
  }

  _getResultHighlight(result, itemKey) {
    let highlightText = '';
    let highlightItem = result.highlighting;
    if (typeof highlightItem !== 'undefined') {
      if (Object.keys(highlightItem).length === 0 && highlightItem.constructor === Object) {
        highlightText = (
          <div>Kein Ausschnitt vorhanden.</div>
        );
      } else {
        var array = [];
        for (var field in highlightItem.fields) {
          if (!highlightItem.fields.hasOwnProperty(field)) continue;
          array.push(highlightItem.fields[field]);
        }

        highlightText = array.map((field, index) => {
          return (
            <div key={index} dangerouslySetInnerHTML={{__html: field}}/>
          );
        });
      }
    }

    let highlightMelody = '';
    if (typeof result.melodic !== 'undefined' && typeof result.json !== 'undefined') {
      let melodic = result.melodic.sort((a, b) => {
        return b.similarity - a.similarity;
      })[0].highlight.map(item => {
        return item.measure;
      }).filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      
      let highlightMeasures = [];
      for (var i = 0; i < melodic.length; i++) {
        highlightMeasures.push(result.json.measures[melodic[i]]);
      }
      let tempJson = {
        id: result.json.id,
        attributes: result.json.attributes,
        measures: highlightMeasures
      };
      let tempAbc = json2abc(JSON.stringify(tempJson));
      highlightMelody = (
        <div>
          <AbcViewer abc={tempAbc} itemKey={itemKey} player={false} />
          <p><span className="text-info">DEBUG</span> <span className="text-muted">Similarity: {result.maxSimilarity}</span></p>
          <p><span className="text-info">RANK</span> <span className="text-muted">Rank: {result.rank}</span></p>
        </div>
      );
    }

    return (
      <div>
        <div className="text">{ highlightText }</div>
        <div className="melody">{ highlightMelody }</div>
      </div>
    );
  }

  _getList(results) {
    return results.map((result, index) => {
      return (
        <div className="search-result-item col-xs-12" key={index}>
          <div className="content">
            <div className="header">
              { this._getContainer(result, index) }
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    let renderedResults = this.props.results.length > 0 ? (
      this._getList(this.props.results)
    ) : (
      <div className="empty-results col-xs-12">
        <h3 className="text-center">Für deine Suchanfrage konnten keine Ergebnisse gefunden werden.</h3>
      </div>
    );

    return (
      <div className="row">
        { renderedResults }
      </div>
    );
  }
}