import React, { PropTypes } from 'react';

import '../../stylesheets/Accordion.less';

export default class UploadProgressList extends React.Component {

  static propTypes = {
    responses: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  constructor(props) {
    super(props);
  }

  _getList(responses) {
    return responses.map((response, index) => {
      let statusClass = ''
      switch (response.ok) {
        case 0:
          statusClass = 'times-circle-o';
          break;
        case 1:
          statusClass = 'check-circle-o';
          break;
        default:
          statusClass = 'circle-o-notch fa-spin';
          break;
      }
      let file = response.value;
      return (
        <div className="rc-collapse-item" key={index}>
          <div className="rc-collapse-header">
            <i className={`fa fa-${statusClass}`}></i>
            <div className="header">{file.signature} - {file.title} ({file.name})</div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="rc-collapse">
        { this._getList(this.props.responses) }
      </div>
    );
  }
}