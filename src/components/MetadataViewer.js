import React, { PropTypes } from 'react';
import SolrService from '../services/SolrService';
import { FIELDS } from '../constants/SolrConstants';
import { Table } from 'react-bootstrap';
import _ from 'lodash';
import '../stylesheets/MetadataViewer.less';

export default class AbcViewer extends React.Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
    context: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SolrService.findDoc(this.props.file.signature, this.props.context);
  }

  _getTableRows(file) {
    if (_.has(file, 'metadata')) {
      return FIELDS.map(field => {
        let label = field.display;
        let value = file.metadata[field.name];
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
            {this._getTableRows(this.props.file)}
          </tbody>
        </Table>
      </div>
    );
  }

}
