import React, { PropTypes, Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './App';

import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

export default class Root extends Component {
  static propTypes = {}

  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        <Route name="home" path="/" component={App}>
          <IndexRoute component={HomePage} />
          <Route name="admin" path="admin" component={AdminPage} />
        </Route>
      </Router>
    );
  }
}
