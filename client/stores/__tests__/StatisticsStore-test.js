import {
  UPDATE_MELODIC_STATISTIC,
  UPDATE_DATE_STATISTIC,
  UPDATE_GEO_STATISTIC,
  UPDATE_TAG_STATISTIC,
  UPDATE_GRAPH_NODES,
  UPDATE_GRAPH_EDGES
} from '../../constants/StatisticsConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('StatisticsStore', () => {

  var AppDispatcher;
  var StatisticsStore;
  var callback;

  var melodicDummyResponse = {
    mode: 'notes',
    data: {
      labels: ['label 1', 'label 2'],
      values: [1, 2]
    }
  };
  var dateDummyResponse = [
    { name: 'Dates 1', data: [ [-5459270400000, 0], [-5427734400000, 1] ] },
    { name: 'Dates 2', data: [ [-5459270400000, 2], [-5427734400000, 3] ] }
  ];
  var tagDummyData = [
    { value: 'value 1', count: 1 },
    { value: 'value 2', count: 2 }
  ];
  var graphDummyEdges = [
    { from: 'abc123', to: 'xyz456', length: 300, title: 'Title 1' },
    { from: 'abc123', to: 'def789', length: 600, title: 'Title 2' }
  ];

  var actionUpdateMelodicStatistics = {
    actionType: UPDATE_MELODIC_STATISTIC,
    response: melodicDummyResponse
  };

  var actionUpdateDateStatistics = {
    actionType: UPDATE_DATE_STATISTIC,
    data: dateDummyResponse
  };

  var actionUpdateArchiveStatistics = {
    actionType: UPDATE_GEO_STATISTIC,
    mode: 'archive',
    labels: ['label 1', 'label 2'],
    values: [1, 2]
  };

  var actionUpdateOriginStatistics = {
    actionType: UPDATE_GEO_STATISTIC,
    mode: 'origin',
    labels: ['label 1', 'label 2'],
    values: [1, 2]
  };

  var actionUpdateTagStatistics = {
    actionType: UPDATE_TAG_STATISTIC,
    mode: 'singPlace',
    data: tagDummyData
  };

  var actionUpdateGraphNodes = {
    actionType: UPDATE_GRAPH_NODES,
    node: {
      group: '',
      id: 'abc123',
      label: 'abc123',
      title: 'Title 1'
    }
  };

  var actionUpdateGrpahEdges = {
    actionType: UPDATE_GRAPH_EDGES,
    edges: graphDummyEdges
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    StatisticsStore = require('../StatisticsStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize empty', () => {
    let {
      notes,
      intervals,
      durations,
      rests,
      keys,
      meters,
      counts,
      dates,
      origin,
      archive,
      singPlace,
      graph
    } = StatisticsStore;
    expect(notes.labels.length).toBe(0);
    expect(notes.values.length).toBe(0);
    expect(intervals.labels.length).toBe(0);
    expect(intervals.values.length).toBe(0);
    expect(durations.labels.length).toBe(0);
    expect(durations.values.length).toBe(0);
    expect(rests.labels.length).toBe(0);
    expect(rests.values.length).toBe(0);
    expect(keys.labels.length).toBe(0);
    expect(keys.values.length).toBe(0);
    expect(meters.labels.length).toBe(0);
    expect(meters.values.length).toBe(0);
    expect(counts.length).toBe(0);
    expect(dates.length).toBe(0);
    expect(origin).toBe(false);
    expect(archive).toBe(false);
    expect(singPlace.length).toBe(0);
    expect(graph.nodes.length).toBe(0);
    expect(graph.edges.length).toBe(0);
  });

  it('should update melodic statistics', () => {
    callback(actionUpdateMelodicStatistics);
    expect(StatisticsStore.notes.labels.length).toBe(2);
    expect(StatisticsStore.notes.values.length).toBe(2);
    expect(StatisticsStore.notes.labels).toContain('label 1');
    expect(StatisticsStore.notes.labels).toContain('label 2');
    expect(StatisticsStore.notes.values).toContain(1);
    expect(StatisticsStore.notes.values).toContain(2);
    expect(StatisticsStore.notes.values).toContain(2);
  });

  it('should update date statistics', () => {
    callback(actionUpdateDateStatistics);
    expect(StatisticsStore.dates.length).toBe(2);
    expect(StatisticsStore.dates).toEqual(dateDummyResponse);
  });

  it('should update geo statistics', () => {
    callback(actionUpdateArchiveStatistics);
    expect(StatisticsStore.archive.labels.length).toBe(2);
    expect(StatisticsStore.archive.values.length).toBe(2);
    expect(StatisticsStore.archive.labels).toContain('label 1');
    expect(StatisticsStore.archive.labels).toContain('label 2');
    expect(StatisticsStore.archive.values).toContain(1);
    expect(StatisticsStore.archive.values).toContain(2);
    expect(StatisticsStore.archive.values).toContain(2);

    callback(actionUpdateOriginStatistics);
    expect(StatisticsStore.origin.labels.length).toBe(2);
    expect(StatisticsStore.origin.values.length).toBe(2);
    expect(StatisticsStore.origin.labels).toContain('label 1');
    expect(StatisticsStore.origin.labels).toContain('label 2');
    expect(StatisticsStore.origin.values).toContain(1);
    expect(StatisticsStore.origin.values).toContain(2);
    expect(StatisticsStore.origin.values).toContain(2);
  });

  it('should update tag statistics', () => {
    callback(actionUpdateTagStatistics);
    expect(StatisticsStore.singPlace.length).toBe(2);
    expect(StatisticsStore.singPlace).toEqual(tagDummyData);
  });

  it('should update graph nodes', () => {
    callback(actionUpdateGraphNodes);
    expect(StatisticsStore.graph.nodes.length).toBe(1);
    expect(StatisticsStore.graph.nodes[0]).toEqual({
      group: '',
      id: 'abc123',
      label: 'abc123',
      title: 'Title 1'
    });
  });

  it('should update graph edges', () => {
    callback(actionUpdateGrpahEdges);
    expect(StatisticsStore.graph.edges.length).toBe(2);
    expect(StatisticsStore.graph.edges).toEqual(graphDummyEdges);
  });

});