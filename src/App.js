import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import LoginStore from './stores/LoginStore';
import Navbar from './components/Navbar';
import MidiService from './services/MidiService';

require('expose?$!expose?jQuery!jquery');
require('!bootstrap-webpack!../config/bootstrap.config');
require('font-awesome-webpack!../config/font-awesome.config');

var headerLinks = [
  { path: '/overview', title: 'Übersicht', nav: true, auth: false},
  { path: '/songsheets', title: 'Liedblätter', nav: true, auth: false },
  { path: '/search', title: 'Suche', nav: true, auth: false }
];

var footerLinks = [
  { path: '/upload', title: 'Upload', nav: true, auth: true },
  { path: '/login', title: 'Login', nav: false, auth: false },
  { path: '/logout', title: 'Logout', nav: true, auth: true },
  { path: '/imprint', title: 'Impressum', nav: true, auth: false }
];


export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };

  static willTransitionTo(transition) {
    if (!LoginStore.isLoggedIn()) {
      transition.redirect('/login', {}, {'nextPath': transition.path});
    }
  }

  constructor() {
    super();
    this.state = this._getLoginState();
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);

    MidiService.loadPlugin();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }

  _getLoginState() {
    return {
      userLoggedIn: LoginStore.isLoggedIn(),
      user: LoginStore.user,
      jwt: LoginStore.jwt
    };
  }

  _onChange() {
    this.setState(this._getLoginState());
  }

  render() {
    return (
      <DocumentTitle title="MusicIR App">
        <div className="App">
          <Navbar header={true} links={headerLinks} route={this.props.location.pathname} />
          <div className="container-fluid" id="app">
            {this.props.children}
          </div>
          <Navbar header={false} links={footerLinks} route={this.props.location.pathname} />
        </div>
      </DocumentTitle>
    );
  }
}