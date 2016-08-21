import React, { PropTypes } from 'react';
import MelodyHelper from '../../helpers/MelodyHelper';
import {
  MELODY_DEFAULT_ABC
} from '../../constants/MelodyConstants';

export default class QueryBreadcrumb extends React.Component {

  static propTypes = {
    metadataQuery: PropTypes.arrayOf(PropTypes.object),
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

    let renderedParsonQuery = parsonQuery.length > 1 ? (
      <span className="label label-default">{`Parsons Code: ${parsonQuery}`}</span>
    ) : '';

    let renderedIntervalQuery = intervalQuery.length > 1 ? (
      <span className="label label-default">{`Intervalle: ${intervalQuery}`}</span>
    ) : '';

    let renderedMelodyQuery = melodyQuery.length > 0 ? (
      <span className="label label-melody">
        Melodie: <AbcViewer abc={MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, melodyQuery)} itemKey={-1} player={false} />
      </span>
    ) : '';

    return (
      <span>
        {renderedMetadataQuery}
        {renderedParsonQuery}
        {renderedIntervalQuery}
        {renderedMelodyQuery}
      </span>
    )
  }
}