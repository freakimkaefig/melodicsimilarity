import React from 'react';
import DocumentTitle from 'react-document-title';
import LoadingOverlay from '../components/LoadingOverlay';
import { APP_NAME } from '../constants/AppConstants';
import { FIELDS } from '../constants/SolrConstants';
import { MODES } from '../constants/MelodyConstants';
import SearchService from '../services/SearchService';
import SearchStore from '../stores/SearchStore';
import SettingsStore from '../stores/SettingsStore';
import MetadataSearchbox from '../components/Search/MetadataSearchbox';
import MelodicSearchbox from '../components/Search/MelodicSearchbox';

export default class SearchIndex extends React.Component {
  static displayName = 'SearchIndex';

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
        if (SearchStore.melodyQuery.length > 1) {
          melodyQuery = {
            melody: SearchStore.melodyQuery,
            threshold: SearchStore.threshold,
            method: SettingsStore.settings['method'].value
          };
        }
        break;

      case 'INTERVALS':
        if (SearchStore.intervalQuery.length > 1) {
          melodyQuery = {
            intervals: SearchStore.intervalQuery,
            threshold: SearchStore.threshold
          };
        }
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
          <h1 className="text-center">Suche</h1>
          <MetadataSearchbox fields={FIELDS} submit={this.handleSubmit} />
          <MelodicSearchbox submit={this.handleSubmit} />
        </div>
      </DocumentTitle>
    )
  }
}