import React, { PropTypes } from 'react';
import { FIELDS } from '../constants/SolrConstants';
import { Table } from 'react-bootstrap';
import '../stylesheets/MetadataViewer.less';

export default class AbcViewer extends React.Component {

  static propTypes = {
    metadata: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ])
  };

  constructor(props) {
    super(props);
  }

  _getTableRows(data) {
    if (typeof data !== 'undefined') {
      return FIELDS.map(field => {
        let label = field.display;

        let value = '';
        if (typeof data[field.name] !== 'undefined') {
          value = data[field.name];
        }

        return (
          <tr key={'label-' + field.name}>
            <td style={{textTransform: 'capitalize'}}>{label}</td>
            <td style={{ whiteSpace: 'pre-wrap'}}>{value}</td>
          </tr>
        )
      });
    }
  }

  render() {
    return (
      <div className="metadata">
        <Table responsive>
          <tbody>
            {this._getTableRows(this.props.metadata)}
          </tbody>
        </Table>
      </div>
    );
  }

}
