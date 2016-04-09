import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import LoginStore from './stores/LoginStore';
import Navbar from './components/Navbar';

require('expose?$!expose?jQuery!jquery');
require('!bootstrap-webpack!../config/bootstrap.config');
require('font-awesome-webpack!../config/font-awesome.config');

var headerLinks = [
  { to: '/', component: 'HomePage', title: 'Home', nav: true, auth: false, default: true }
];

var footerLinks = [
  { to: 'admin', component: 'AdminPage', title: 'Admin', nav: true, auth: false },
  { to: 'logout', component: 'HomePage', title: 'Logout', nav: true, auth: true }
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

  _getLoginState() {
    return {
      userLoggedIn: LoginStore.isLoggedIn(),
      user: LoginStore.user,
      jwt: LoginStore.jwt
    };
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
  }

  _onChange() {
    this.setState(this._getLoginState());
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }

  render() {
    return (
      <DocumentTitle title="MusicIR App">
        <div className="App">
          <Navbar header={true} links={headerLinks} route={this.props.children.type.name} />
          <div className="container">
            {this.props.children}
          </div>
          <Navbar header={false} links={footerLinks} route={this.props.children.type.name} />
        </div>
      </DocumentTitle>
    );
  }
}