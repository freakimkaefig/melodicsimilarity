var React = require('react');
var Actions = require( '../actions/Actions');
var Store = require( '../stores/Store');


var AwesomeComponent = React.createClass({
  getInitialState: function() {
    return Store.get();
  },

  componentDidMount: function() {
    Store.addListener('change', this.changeEventHandler);
  },

  changeEventHandler: function() {
    this.setState(Store.get());
  },

  handleChange: function(event) {
    Actions.set(event.target.value);
  },

  handleButtonClick: function(event) {
    Actions.add(1);
  },

  render: function() {
    return (
      <div>
        <div>
          Likes: <span>{this.state.count}: {this.state.value}</span>
        </div>
        <input onChange={this.handleChange} defaultValue={this.state.value} type="text"/>
        <div><button onClick={this.handleButtonClick}>Like Me</button></div>
      </div>
    );
  }
});

module.exports = AwesomeComponent;
