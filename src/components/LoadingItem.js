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
    let zIndex = this.props.loading === true ? 999999 : -1;
    let opacity = this.props.loading === true ? 1 : 0;
    return (
      <div className="loading-item" style={{
        zIndex: zIndex,
        opacity: opacity
      }}>
        <span className="fa fa-circle-o-notch fa-spin"></span>
      </div>
    )
  }
}