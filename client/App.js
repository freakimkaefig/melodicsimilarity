import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import LoginStore from './stores/LoginStore';
import Navbar from './components/Navbar';
import MidiService from './services/MidiService';
import {
  settings
} from '../server/config/api.config.json';
import SettingsService from './services/SettingsService';
import 'expose?$!expose?jQuery!jquery';
import '!bootstrap-webpack!../config/bootstrap.config';
import 'flexboxgrid';
import './stylesheets/_overwrites.less';
import 'font-awesome-webpack!../config/font-awesome.config';
import Highcharts from 'highcharts';
require('highcharts-exporting')(Highcharts);
require('highcharts-more')(Highcharts);

var headerLinks = [
  { title: 'Statistik', nav: true, auth: false, dropdown: true, children: [
    { path: '/statistics/melody', title: 'Melodie' },
    { path: '/statistics/metadata', title: 'Metadaten' },
    { path: '/statistics/similarity', title: 'Melodic Similarity' }
  ]},
  { path: '/songsheets', title: 'Liedblätter', nav: true, auth: false, dropdown: false },
  { path: '/search', title: 'Suche', nav: true, auth: false, dropdown: false }
];

var footerLinks = [
  { path: '/settings', title: 'Einstellungen', nav: true, auth: true, dropdown: false },
  { path: '/upload', title: 'Upload', nav: true, auth: true, dropdown: false },
  { path: '/login', title: 'Login', nav: false, auth: false, dropdown: false },
  { path: '/logout', title: 'Logout', nav: true, auth: true, dropdown: false },
  { path: '/imprint', title: 'Impressum', nav: true, auth: false, dropdown: false }
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

    settings.forEach((item) => {
      SettingsService.getField(item.key);
    });
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
          <Navbar header={true} fixedTop={true} links={headerLinks} route={this.props.location.pathname} loggedIn={this.state.userLoggedIn} />
          <div className="container-fluid" id="app">
            {this.props.children}
          </div>
          <Navbar header={false} fixedBottom={false} links={footerLinks} route={this.props.location.pathname} loggedIn={this.state.userLoggedIn} />
        </div>
      </DocumentTitle>
    );
  }
}