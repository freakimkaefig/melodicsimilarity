import React, { PropTypes } from 'react';
import MelodyHelper from '../../helpers/MelodyHelper';
import {
  MODES,
  MELODY_DEFAULT_ABC
} from '../../constants/MelodyConstants';
import {
  FIELDS
} from '../../constants/SolrConstants';
import {
  search
} from '../../../server/config/api.config.json';
import AbcViewer from '../AbcViewer';

export default class QueryBreadcrumb extends React.Component {

  static propTypes = {
    metadataQuery: PropTypes.arrayOf(PropTypes.object),
    melodyMode: PropTypes.number,
    parsonQuery: PropTypes.string,
    intervalQuery: PropTypes.string,
    melodyQuery: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {
      metadataQuery,
      melodyMode,
      parsonQuery,
      intervalQuery,
      melodyQuery
    } = this.props;

    let renderedMetadataQuery = metadataQuery.map((field, index) => {
      let fieldName = '';
      if (field.name === 'search') {
        fieldName = 'Freie Suche';
      } else {
        let fieldConfig = FIELDS.find(item => {
          return item.name === field.name;
        });
        if (typeof fieldConfig !== 'undefined') {
          fieldName = fieldConfig.display;
        }
      }

      return (
        <span className="label label-default" key={index}>{`${fieldName}: ${field.value}`}</span>
      );
    });

    let renderedMelodyQuery = '';
    switch(melodyMode) {
      case MODES.indexOf(search.melodyMode.melody.name):
        renderedMelodyQuery = melodyQuery.length > 0 ? (
          <span className="label label-melody">
            Melodie: <AbcViewer abc={MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, melodyQuery)} itemKey={-1} player={false} />
          </span>
        ) : '';
        break;

      case MODES.indexOf(search.melodyMode.intervals.name):
        renderedMelodyQuery = intervalQuery.length > 1 ? (
          <span className="label label-default">{`Intervalle: ${intervalQuery}`}</span>
        ) : '';
        break;

      case MODES.indexOf(search.melodyMode.parsons.name):
        renderedMelodyQuery = parsonQuery.length > 1 ? (
          <span className="label label-default">{`Parsons Code: ${parsonQuery}`}</span>
        ) : '';
        break;
    }

    return (
      <span>
        {renderedMetadataQuery}
        {renderedMelodyQuery}
      </span>
    )
  }
}