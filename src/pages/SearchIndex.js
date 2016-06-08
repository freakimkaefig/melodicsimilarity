import React from 'react';
import DocumentTitle from 'react-document-title';
import LoadingOverlay from '../components/LoadingOverlay';
import { APP_NAME } from '../constants/AppConstants';
import { FIELDS } from '../constants/SolrConstants';
import { MODES } from '../constants/MelodyConstants';
import SearchService from '../services/SearchService';
import SearchStore from '../stores/SearchStore';
import MetadataSearchbox from '../components/search/MetadataSearchbox';
import MelodicSearchbox from '../components/search/MelodicSearchbox';

export default class SearchIndex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    var solrQuery = SearchStore.query.isEmpty() ? false : SearchStore.query.getQueryUrl();

    var melodyQuery = false;
    var melodyMode = MODES[SearchStore.melodyMode];
    switch (melodyMode) {
      case 'MELODY':
        break;

      case 'INTERVALS':
        break;

      case 'PARSONS':
        if (SearchStore.parsonQuery.length > 1) {
          melodyQuery = {
            parson: SearchStore.parsonQuery,
            threshold: SearchStore.threshold
          };
        }
        break;
    }

    console.log(solrQuery, melodyMode, melodyQuery);

    SearchService.search(solrQuery, melodyMode, melodyQuery);

    this.setState({
      loading: true
    });
  }

  render() {
    return (
      <DocumentTitle title={`Suche // ${APP_NAME}`}>
        <div>
          <LoadingOverlay loading={this.state.loading} />
          <h1>Suche</h1>
          <MetadataSearchbox fields={FIELDS} submit={this.handleSubmit} />
          <MelodicSearchbox submit={this.handleSubmit} />
        </div>
      </DocumentTitle>
    )
  }
}