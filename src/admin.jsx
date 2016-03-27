var React = require('react');
var ReactDOM = require('react-dom');

var Layout = require('./components/layout/Layout.jsx');

var AdminComponent = React.createClass({
  render: function() {
    return (
      <div>Hello Again</div>
    );
  }
});

ReactDOM.render(
  <div>
    <Layout>
      <AdminComponent />
    </Layout>
  </div>,
  document.getElementById('react-container')
);