import React from 'react';
import {render} from 'react-dom';

require('expose?$!expose?jQuery!jquery');
require('./stylesheets/app.less');

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AwesomeComponent from './components/AwesomeComponent.jsx';

class App extends React.Component {
  render () {
    return (
      <div className="container">
        <Header />
        <p>Hello React!</p>
        <AwesomeComponent />
        <Footer />
      </div>
    );
  }
}

render(<App/>, document.getElementById('react-container'));