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
import QueryBreadcrumb from '../components/Search/QueryBreadcrumb';
import SearchResultList from '../components/Search/SearchResultList';
import {
  Pagination
} from 'react-bootstrap';
import '../stylesheets/ResultList.less';

export default class ResultList extends React.Component {
  static displayName = 'ResultList';

  constructor(props) {
    super(props);

    this.state = {
      metadataQueryFields: SearchStore.queryFields,
      melodyMode: SearchStore.melodyMode,
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
      melodyMode: SearchStore.melodyMode,
      parsonQuery: SearchStore.parsonQuery,
      intervalQuery: SearchStore.intervalQuery,
      melodyQuery: SearchStore.melodyQuery,
      results: SearchStore.results,
      highlighting: SearchStore.highlighting,
      activePage: (SearchStore.start / SearchStore.rows) + 1,
      numPages: this.getNumPages()
    });
  }

  handleSelect(event, {eventKey}) {
    event.preventDefault();

    SearchActions.updateStart((eventKey - 1) * SearchStore.rows);
  }
  
  render() {
    let {
      metadataQueryFields,
      melodyMode,
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
                <Breadcrumb.Item active>
                  <QueryBreadcrumb
                    metadataQuery={metadataQueryFields}
                    melodyMode={melodyMode}
                    parsonQuery={parsonQuery}
                    intervalQuery={intervalQuery}
                    melodyQuery={melodyQuery}
                  />
                </Breadcrumb.Item>
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