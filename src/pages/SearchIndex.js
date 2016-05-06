import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';

export default class SearchIndex extends React.Component {
  static propTypes = {};

  render() {
    return (
      <DocumentTitle title={`Suche // ${APP_NAME}`}>
        <h1>Suche</h1>
      </DocumentTitle>
    )
  }
}