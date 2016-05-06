import React, { PropTypes } from 'react';
import Collapse from './Accordion/index';

import '../stylesheets/FileList.less';

export default class FileList extends React.Component {

  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderFunction: PropTypes.func.isRequired,
    onCheckboxClick: PropTypes.func,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Collapse accordion={true} onChange={this.props.onChange}>
        { this.props.renderFunction(this.props) }
      </Collapse>
    );
  }
}