import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { APP_NAME } from '../constants/AppConstants';
import { Link } from 'react-router';

export default class NotFoundPage extends React.Component {
  static displayName = 'NotFoundPage';
  static propTypes = {};

  render() {
    return (
      <DocumentTitle title={`404 // ${APP_NAME}`}>
        <div className="offset-container">

          <div className="row">
            <div className="col-xs-12">
              <h1 className="text-center">404</h1>
              <p>Die angeforderte Seite konnte nicht gefunden werden.</p>
              <Link to="/">Zurück zur Startseite</Link>
            </div>
          </div>

        </div>
      </DocumentTitle>
    )
  }
}