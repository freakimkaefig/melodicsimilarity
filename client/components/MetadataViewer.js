import React, { PropTypes } from 'react';
import { FIELDS } from '../constants/SolrConstants';
import { Table } from 'react-bootstrap';
import '../stylesheets/MetadataViewer.less';

export default class AbcViewer extends React.Component {

  static propTypes = {
    metadata: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    highlight: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    highlight: []
  };

  constructor(props) {
    super(props);
  }

  _getTableRows(data, highlight) {
    if (typeof data !== 'undefined') {
      return FIELDS.map(field => {
        let label = field.display;

        let value = '';
        if (typeof data[field.name] !== 'undefined') {
          value = data[field.name];
        }

        let highlightClass = '';
        if (typeof highlight !== 'undefined') {
          let highlightItem = highlight.find(item => {
            return item.name === field.name
              && item.value === value;
          });
          highlightClass = typeof highlightItem !== 'undefined' ? 'highlight' : '';
        }

        return (
          <tr key={'label-' + field.name} className={highlightClass}>
            <td className="field-label">{label}</td>
            <td className="field-value">{value}</td>
          </tr>
        );
      });
    }
  }

  render() {
    return (
      <div className="metadata">
        <Table responsive>
          <tbody>
            {this._getTableRows(this.props.metadata, this.props.highlight)}
          </tbody>
        </Table>
      </div>
    );
  }

}
