import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';

export default class HomePage extends React.Component {
  static propTypes = {};

  render() {
    return (
      <DocumentTitle title={`Übersicht // ${APP_NAME}`}>
        <div>
          <div className="row">
            <div className="col-xs-12">
              <h1>Übersicht</h1>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}