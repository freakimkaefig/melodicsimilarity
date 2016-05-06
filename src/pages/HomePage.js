import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';

export default class HomePage extends React.Component {
  static propTypes = {};

  render() {
    return (
        <h1>Home</h1>
      <DocumentTitle title={`Home // ${APP_NAME}`}>
      </DocumentTitle>
    )
  }
}