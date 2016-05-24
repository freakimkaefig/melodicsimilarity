import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { browserHistory } from 'react-router';
import { APP_NAME } from '../constants/AppConstants';
import SolrService from '../services/SolrService';
import SolrStore from '../stores/SolrStore';
import SearchStore from '../stores/SearchStore';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import LoadingItem from '../components/LoadingItem';
import SearchResultList from '../components/Search/SearchResultList';
import {Pagination} from 'react-bootstrap';
import '../stylesheets/ResultList.less';

export default class ResultList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: SolrStore.query,
      results: SolrStore.results,
      highlighting: SolrStore.highlighting,
      activePage: (SearchStore.start / SearchStore.rows) + 1,
      numPages: this.getNumPages()
    };

    this.onSolrStoreChange = this.onSolrStoreChange.bind(this);
    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }

  componentWillMount() {
    SolrStore.addChangeListener(this.onSolrStoreChange);
    SearchStore.addChangeListener(this.onSearchStoreChange);
    if (this.state.query.length === 0) {
      browserHistory.push('/search');
    }
  }

  componentWillUnmount() {
    SolrStore.removeChangeListener(this.onSolrStoreChange);
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }

  getNumPages() {
    return Math.ceil(SolrStore.numFound / SearchStore.rows);
  }

  onSolrStoreChange() {
    this.setState({
      query: SolrStore.query,
      results: SolrStore.results,
      highlighting: SolrStore.highlighting,
      numPages: this.getNumPages()
    });
  }

  onSearchStoreChange() {
    if (this.state.activePage !== (SearchStore.start / SearchStore.rows) + 1) {

    }
    this.setState({
      activePage: (SearchStore.start / SearchStore.rows) + 1,
      numPages: this.getNumPages()
    });
  }

  _renderQuery(query) {
    if (query.length > 0) {
      return query.map((field, index) => {
        return (
          <span className="label label-default" key={index}>{`${field.name}: ${field.value}`}</span>
        );
      });
    }
  }

  handleSelect(event, {eventKey}) {
    event.preventDefault();

    // Trigger new search for selected page
    SolrService.search(
      SearchStore.fields,
      SearchStore.operator,
      (eventKey - 1) * SearchStore.rows,
      SearchStore.rows
    );
  }
  
  render() {
    return (
      <DocumentTitle title={`Suche // ${APP_NAME}`}>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <Breadcrumb>
                <LinkContainer to="/search" key={0}>
                  <Breadcrumb.Item>Suche</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>{this._renderQuery(this.state.query)}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <h1>Ergebnisse</h1>
            </div>
          </div>

          <LoadingItem loading={this.state.results <= 0}/>
          <SearchResultList results={this.state.results} highlighting={this.state.highlighting} />
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