import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { browserHistory } from 'react-router';
import { APP_NAME } from '../constants/AppConstants';
import SolrStore from '../stores/SolrStore';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import LoadingItem from '../components/LoadingItem';
import SearchResultList from '../components/Search/SearchResultList';
import '../stylesheets/ResultList.less';


export default class ResultList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: SolrStore.query,
      results: SolrStore.results,
      highlighting: SolrStore.highlighting
    };

    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    SolrStore.addChangeListener(this.onStoreChange);
    if (this.state.query.length === 0) {
      browserHistory.push('/search');
    }
  }

  componentWillUnmount() {
    SolrStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState({
      query: SolrStore.query,
      results: SolrStore.results,
      highlighting: SolrStore.highlighting
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
        </div>
      </DocumentTitle>
    )
  }
}