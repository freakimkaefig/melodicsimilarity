var React = require('react');
var ReactDOM = require('react-dom');

// var Header = require('./components/Header.jsx');
// var Footer = require('./components/Footer.jsx');
var Layout = require('./components/layout/Layout.jsx');
var AwesomeComponent = require('./components/AwesomeComponent.jsx');

require('./stylesheets/index.less');

ReactDOM.render(
  <div>
    <Layout>
      <p>Hello React!</p>
      <AwesomeComponent />
    </Layout>
  </div>,
  document.getElementById('react-container')
);
