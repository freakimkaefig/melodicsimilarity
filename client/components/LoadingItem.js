import React, { PropTypes } from 'react';
import '../stylesheets/LoadingItem.less';


export default class LoadingItem extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }
  
  render() {
    let display = this.props.loading === true ? 'block' : 'none';
    return (
      <div className="loading-item" style={{
        display: display
      }}>
        <span className="fa fa-circle-o-notch fa-spin"></span>
      </div>
    )
  }
}