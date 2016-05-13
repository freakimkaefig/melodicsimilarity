import React from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import { FIELDS } from '../constants/SolrConstants';
import MetadataSearchbox from '../components/MetadataSearchbox';

export default class SearchIndex extends React.Component {
  render() {
    return (
      <DocumentTitle title={`Suche // ${APP_NAME}`}>
        <div>
          <h1>Suche</h1>
          <MetadataSearchbox fields={FIELDS} />
        </div>
      </DocumentTitle>
    )
  }
}