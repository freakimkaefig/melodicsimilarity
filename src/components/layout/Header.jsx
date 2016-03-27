var React = require('react');

require('./stylesheets/header.less');

var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        Header
      </div>
    )
  }
});

module.exports = Header;