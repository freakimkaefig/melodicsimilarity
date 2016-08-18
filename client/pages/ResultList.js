import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import {
  browserHistory
} from 'react-router';
import {
  APP_NAME
} from '../constants/AppConstants';
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';
import {
  LinkContainer
} from 'react-router-bootstrap';
import {
  Breadcrumb
} from 'react-bootstrap';
import AbcViewer from '../components/AbcViewer';
import MelodyHelper from '../helpers/MelodyHelper';
import {
  MELODY_DEFAULT_ABC
} from '../constants/MelodyConstants';
import {
  FIELDS
} from '../constants/SolrConstants';
import LoadingItem from '../components/LoadingItem';
import SearchResultList from '../components/Search/SearchResultList';
import {
  Pagination
} from 'react-bootstrap';
import '../stylesheets/ResultList.less';

export default class ResultList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      metadataQueryFields: SearchStore.queryFields,
      parsonQuery: SearchStore.parsonQuery,
      intervalQuery: SearchStore.intervalQuery,
      melodyQuery: SearchStore.melodyQuery,
      results: SearchStore.results,
      highlighting: SearchStore.highlighting,
      activePage: (SearchStore.start / SearchStore.rows) + 1,
      numPages: this.getNumPages()
    };

    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }

  componentWillMount() {
    SearchStore.addChangeListener(this.onSearchStoreChange);
    if (this.state.metadataQueryFields.length === 0
      && this.state.parsonQuery === ''
      && this.state.intervalQuery === ''
      && this.state.melodyQuery.length === 0) {
      browserHistory.push('/search');
    }
  }

  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }

  /**
   * Retrieve number of pages
   * @returns {number} Number of pages
   */
  getNumPages() {
    return Math.ceil(SearchStore.results.length / SearchStore.rows);
  }

  onSearchStoreChange() {
    if (this.state.activePage !== (SearchStore.start / SearchStore.rows) + 1) {

    }
    this.setState({
      metadataQueryFields: SearchStore.queryFields,
      parsonQuery: SearchStore.parsonQuery,
      intervalQuery: SearchStore.intervalQuery,
      results: SearchStore.results,
      highlighting: SearchStore.highlighting,
      activePage: (SearchStore.start / SearchStore.rows) + 1,
      numPages: this.getNumPages()
    });
  }
  
  _renderQuery(metadataQuery, parsonQuery, intervalQuery, melodyQuery) {
    let renderedMetadataQuery = metadataQuery.map((field, index) => {
      let fieldName = '';
      if (field.name === 'search') {
        fieldName = 'Freie Suche';
      } else {
        let fieldConfig = FIELDS.find(item => {
          return item.name === field.name;
        });
        if (typeof fieldConfig !== 'undefined') {
          fieldName = fieldConfig.display;
        }
      }

      return (
        <span className="label label-default" key={index}>{`${fieldName}: ${field.value}`}</span>
      );
    });

    let renderedParsonQuery = parsonQuery.length > 1 ? (
      <span className="label label-default">{`Parsons Code: ${parsonQuery}`}</span>
    ) : '';

    let renderedIntervalQuery = intervalQuery.length > 1 ? (
      <span className="label label-default">{`Intervalle: ${intervalQuery}`}</span>
    ) : '';

    let renderedMelodyQuery = melodyQuery.length > 0 ? (
      <span className="label label-melody">
        Melodie: <AbcViewer abc={MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, melodyQuery)} itemKey={-1} player={false} />
      </span>
    ) : '';

    return (
      <span>
        {renderedMetadataQuery}
        {renderedParsonQuery}
        {renderedIntervalQuery}
        {renderedMelodyQuery}
      </span>
    );
  }

  handleSelect(event, {eventKey}) {
    event.preventDefault();

    SearchActions.updateStart((eventKey - 1) * SearchStore.rows);
  }
  
  render() {
    let {
      metadataQueryFields,
      parsonQuery,
      intervalQuery,
      melodyQuery,
      highlighting
    } = this.state;
    let currentResults = this.state.results.slice(SearchStore.start, SearchStore.start + SearchStore.rows);
    return (
      <DocumentTitle title={`Suche // ${APP_NAME}`}>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <Breadcrumb>
                <LinkContainer to="/search" key={0}>
                  <Breadcrumb.Item>Suche</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>{this._renderQuery(metadataQueryFields, parsonQuery, intervalQuery, melodyQuery)}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <h1>Ergebnisse</h1>
            </div>
          </div>

          <SearchResultList
            results={currentResults}
            highlighting={highlighting} />
          <div className="text-center">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              items={this.state.numPages}
              maxButtons={7}
              activePage={this.state.activePage}
              onSelect={this.handleSelect.bind(this)} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}