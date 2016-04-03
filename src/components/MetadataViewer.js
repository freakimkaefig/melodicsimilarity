import React from 'react';
import SolrStore from '../stores/SolrStore';
import { Table } from 'react-bootstrap';

export default class AbcViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      displayedFields: [
        'signature',
        'title',
        'origin',
        'landscapeArchive',
        'dateFindAid',
        'archive',
        'receivedOn',
        'recorderOn',
        'recorder',
        'singer',
        'singPlace',
        'sungOn',
        'incipit',
        'text'
      ]
    };
  }

  componentDidMount() {
    SolrStore.addChangeListener(this._onFoundDoc);
  }
  componentWillUnmount() {
    SolrStore.removeChangeListener(this._onFoundDoc);
  }


  _onFoundDoc = () => {
    var response = SolrStore.response;
    console.log(response);
    this.setState({docs: response.response.docs});
  };

  // getTableRows() {
  //   this.state
  // }

  getTabHeaders() {
    return this.state.docs.map((doc, index) => {
      let cssClass = (index === 0) ? 'active' : '';
      return (
        <li className={cssClass} key={'header-' + doc.id}>
          <a href={"#" + doc.id} data-toggle="tab" aria-expanded={index === 0}>{doc.signature}</a>
        </li>
      )
    });
  }

  _getTableRows(doc) {
    return this.state.displayedFields.map(field => {
      let label = field.replace(/([A-Z])/g, " $1");
      return (
        <tr  key={'label-' + field}>
          <td style={{textTransform: 'capitalize'}}>{label}</td>
          <td style={{ whiteSpace: 'pre-wrap'}}>{doc[field]}</td>
        </tr>
      )
    })
  }

  getTabContents() {
    return this.state.docs.map((doc, index) => {
      let cssClass = (index === 0) ? 'active in' : '';
      return (
        <div className={"tab-pane fade " + cssClass} id={doc.id} key={'content-' + doc.id}>
          <Table responsive>
            <tbody>
              {this._getTableRows(doc)}
            </tbody>
          </Table>
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        <h3>Metadata</h3>
        <div id="metadata">
          <ul className="nav nav-tabs">
            {this.getTabHeaders()}
          </ul>
          <div id="myTabContent" className="tab-content">
            {this.getTabContents()}
          </div>
        </div>
      </div>
    )
  }

}
