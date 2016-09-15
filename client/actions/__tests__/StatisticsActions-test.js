import {
  UPDATE_MELODIC_STATISTIC,
  UPDATE_DATE_STATISTIC,
  UPDATE_GEO_STATISTIC,
  UPDATE_TAG_STATISTIC,
  UPDATE_GRAPH_NODES,
  UPDATE_GRAPH_EDGES
} from '../../constants/StatisticsConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('StatisticsActions', () => {

  var AppDispatcher;
  var StatisticsActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    StatisticsActions = require('../StatisticsActions').default;
  });

  it('dispatches melodic statistic update', () => {
    StatisticsActions.updateMelodicStatistics({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_MELODIC_STATISTIC,
      response: { key: 'value' }
    });
  });

  it('dispatches date statistic update', () => {
    StatisticsActions.updateDateStatistics({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_DATE_STATISTIC,
      data: { key: 'value' }
    });
  });

  it('dispatches geo statistic update', () => {
    StatisticsActions.updateGeoStatistics('mode', ['A', 'B', 'C'], [1, 2, 3]);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_GEO_STATISTIC,
      mode: 'mode',
      labels: ['A', 'B', 'C'],
      values: [1, 2, 3]
    });
  });

  it('dispatches tag statistic update', () => {
    StatisticsActions.updateTagStatistics('mode', [1, 2, 3]);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_TAG_STATISTIC,
      mode: 'mode',
      data: [1, 2, 3]
    });
  });

  it('dispatches graph nodes statistic update', () => {
    StatisticsActions.updateGraphNodes({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_GRAPH_NODES,
      node: { key: 'value' }
    });
  });

  it('dispatches graph edges statistic update', () => {
    StatisticsActions.updateGraphEdges({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_GRAPH_EDGES,
      edges: { key: 'value' }
    });
  });

});