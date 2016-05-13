import React, { PropTypes } from 'react';


export default class RangeField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  };
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-group">
        <label>{this.props.title}</label>
        <div className="row">
          <div className="col-xs-6">
            <input type="text" name={`range-${this.props.name}`} className="form-control" placeholder="von (Jahr)" />
          </div>
          <div className="col-xs-6">
            <input type="text" name={`range-${this.props.name}`} className="form-control" placeholder="bis (Jahr)" />
          </div>
        </div>
      </div>
    );
  }
}