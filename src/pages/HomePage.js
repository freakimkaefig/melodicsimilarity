import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

export default class HomePage extends React.Component {
  static propTypes = {};

  render() {
    return (
      <DocumentTitle title="Home // MusicIR">
        <h1>Home</h1>
      </DocumentTitle>
    )
  }
}