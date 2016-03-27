var React = require('react');
var ReactDOM = require('react-dom');

var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');

var Layout = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  render: function() {
    return (
      <div>
        <Header />
          <div className="container">{this.props.children}</div>
        <Footer />
      </div>
    )
  }
});

module.exports = Layout;