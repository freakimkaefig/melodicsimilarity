import {
  SEARCH_QUERY_URL,
  UPDATE_FACETS,
  UPDATE_METADATA_QUERY,
  UPDATE_METADATA
} from '../../constants/SolrConstants';
import {
  UPDATE_FIELD_VALUE,
  UPDATE_SEARCH_OPERATOR,
  UPDATE_SEARCH_START,
  RESET_SEARCH,
  START_SEARCH,
  UPDATE_RESULTS
} from '../../constants/SearchConstants';
import {
  INTERVAL_DEFAULT_ABC,
  MELODY_DEFAULT_ABC,
  UPDATE_MODE,
  UPDATE_PARSON_QUERY,
  UPDATE_INTERVAL_QUERY,
  UPDATE_MELODY_QUERY,
  UPDATE_THRESHOLD
} from '../../constants/MelodyConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('SearchStore', () => {

  var AppDispatcher;
  var SearchStore;
  var callback;

  var actionStartSearch = {
    actionType: START_SEARCH
  };

  var actionUpdateFieldValue = {
    actionType: UPDATE_FIELD_VALUE,
    field: 'key',
    value: 'value'
  };

  var actionUpdateOperator = {
    actionType: UPDATE_SEARCH_OPERATOR,
    value: true
  };

  var actionResetSearch = {
    actionType: RESET_SEARCH
  };

  var actionUpdateStart = {
    actionType: UPDATE_SEARCH_START,
    value: 8
  };

  var actionUpdateFacets = {
    actionType: UPDATE_FACETS,
    field: 'key',
    facets: 'value'
  };

  var actionUpdateMetadataQuery = {
    actionType: UPDATE_METADATA_QUERY,
    fields: [ { key1: 'value1' }, { key2: 'value2' } ],
    query: SEARCH_QUERY_URL + '?wt=json&q=key1:value1,key2:value2'
  };

  var actionUpdateMode = {
    actionType: UPDATE_MODE,
    mode: 1
  };

  var actionUpdateThreshold = {
    actionType: UPDATE_THRESHOLD,
    threshold: 90
  };

  var actionUpdateParsonQuery = {
    actionType: UPDATE_PARSON_QUERY,
    parson: '*udr'
  };

  var actionUpdateIntervalQuery = {
    actionType: UPDATE_INTERVAL_QUERY,
    intervals: '* -2 4 -6',
    abc: INTERVAL_DEFAULT_ABC + '^A,D^G,'
  };

  var actionUpdateMelodyQuery = {
    actionType: UPDATE_MELODY_QUERY,
    melody: [
      { pitch: { step: 'C', octave: 4, accidental: '' }, rest: false, duration: 8, type: 'eighth', dot: false },
      { pitch: { step: 'D', octave: 4, accidental: '' }, rest: false, duration: 8, type: 'eighth', dot: false },
      { pitch: { step: 'F', octave: 4, accidental: 'sharp' }, rest: false, duration: 24, type: 'quarter', dot: true }
    ],
    abc: MELODY_DEFAULT_ABC + 'C8D8^F16>'
  };

  var actionUpdateMetadataEmpty = {
    actionType: UPDATE_METADATA,
    response: {
      response: {
        docs: [],
        numFound: 0
      }
    }
  };

  var actionUpdateMetadata = {
    actionType: UPDATE_METADATA,
    response: {
      response: {
        docs: [{
          signature: 'xyz123',
          key1: 'value1',
          key2: 'value2'
        }],
        numFound: 1
      }
    }
  };

  var actionUpdateResults = {
    actionType: UPDATE_RESULTS,
    results: [
      { id: 'xyz123', key: 'value1' },
      { id: 'abc456', key: 'value2' }
    ]
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    SearchStore = require('../SearchStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize correctly', () => {
    let {
      fields,
      operator,
      start,
      rows,
      facets,
      query,
      queryFields,
      results,
      highlighting,
      numFound,
      melodyMode,
      parsonQuery,
      intervalQuery,
      intervalAbc,
      melodyAbc,
      threshold,
      submit
    } = SearchStore;
    expect(fields).toEqual({});
    expect(operator).toBe(false);
    expect(start).toBe(0);
    expect(rows).toBe(8);
    expect(facets).toEqual({});
    expect(query._q.length).toBe(0);
    expect(query._fq).toContain('signature:*');
    expect(query._glue).toBe('OR');
    expect(query._query).toBe(SEARCH_QUERY_URL + '?wt=json');
    expect(queryFields.length).toBe(0);
    expect(results.length).toBe(0);
    expect(highlighting).toEqual({});
    expect(numFound).toBe(0);
    expect(melodyMode).toBe(0);
    expect(parsonQuery).toBe('');
    expect(intervalQuery).toBe('');
    expect(intervalAbc).toBe(INTERVAL_DEFAULT_ABC);
    expect(melodyAbc).toBe(MELODY_DEFAULT_ABC);
    expect(threshold).toBe(50);
    expect(submit).toBe(false);
  });

  it('should start search', () => {
    callback(actionUpdateResults);
    expect(SearchStore.results.length).toBe(2);

    callback(actionStartSearch);
    expect(SearchStore.results.length).toBe(0);
  });

  it('should update field value', () => {
    callback(actionUpdateFieldValue);
    expect(SearchStore.fields).toEqual({ key: 'value' });
  });

  it('should update operator', () => {
    callback(actionUpdateOperator);
    expect(SearchStore.operator).toBe(true);
  });

  it('should reset search', () => {
    callback(actionResetSearch);
    let {
      fields,
      operator,
      start,
      rows,
      query,
      queryFields,
      results,
      highlighting,
      numFound,
      parsonQuery,
      intervalQuery,
      intervalAbc,
      melodyAbc,
      threshold,
      submit
    } = SearchStore;
    expect(fields).toEqual({});
    expect(operator).toBe(false);
    expect(start).toBe(0);
    expect(rows).toBe(8);
    expect(query._q.length).toBe(0);
    expect(query._fq).toContain('signature:*');
    expect(query._glue).toBe('OR');
    expect(query._query).toBe(SEARCH_QUERY_URL + '?wt=json');
    expect(queryFields.length).toBe(0);
    expect(results.length).toBe(0);
    expect(highlighting).toEqual({});
    expect(numFound).toBe(0);
    expect(parsonQuery).toBe('');
    expect(intervalQuery).toBe('');
    expect(intervalAbc).toBe(INTERVAL_DEFAULT_ABC);
    expect(melodyAbc).toBe(MELODY_DEFAULT_ABC);
    expect(threshold).toBe(50);
    expect(submit).toBe(false);
  });

  it('should update start', () => {
    callback(actionUpdateStart);
    expect(SearchStore.start).toBe(8);
  });

  it('should update facets', () => {
    callback(actionUpdateFacets);
    expect(SearchStore.facets.key).toEqual('value');
  });

  it('should update metadata query', () => {
    callback(actionUpdateMetadataQuery);
    let {
      queryFields,
      query,
      results,
      highlighting
    } = SearchStore;
    expect(queryFields).toEqual([ { key1: 'value1' }, { key2: 'value2' } ]);
    expect(query).toEqual(SEARCH_QUERY_URL + '?wt=json&q=key1:value1,key2:value2');
    expect(results.length).toBe(0);
    expect(highlighting).toEqual({});
  });

  it('should update melody mode', () => {
    callback(actionUpdateMode);
    expect(SearchStore.melodyMode).toBe(1);
  });

  it('should update threshold', () => {
    callback(actionUpdateThreshold);
    expect(SearchStore.threshold).toBe(90);
  });

  it('should update parson query', () => {
    callback(actionUpdateParsonQuery);
    expect(SearchStore.parsonQuery).toBe('*udr');
  });

  it('should update interval query', () => {
    callback(actionUpdateIntervalQuery);
    expect(SearchStore.intervalQuery).toBe('* -2 4 -6');
    expect(SearchStore.intervalAbc).toBe(INTERVAL_DEFAULT_ABC + '^A,D^G,');
  });

  it('should update melody query', () => {
    callback(actionUpdateMelodyQuery);
    expect(SearchStore.melodyQuery.length).toBe(3);
    expect(SearchStore.melodyQuery).toEqual([
      { pitch: { step: 'C', octave: 4, accidental: '' }, rest: false, duration: 8, type: 'eighth', dot: false },
      { pitch: { step: 'D', octave: 4, accidental: '' }, rest: false, duration: 8, type: 'eighth', dot: false },
      { pitch: { step: 'F', octave: 4, accidental: 'sharp' }, rest: false, duration: 24, type: 'quarter', dot: true }
    ]);
    expect(SearchStore.melodyAbc).toBe(MELODY_DEFAULT_ABC + 'C8D8^F16>');
  });

  it('should update metadata', () => {
    callback(actionUpdateMetadataEmpty);
    expect(SearchStore.results.length).toBe(0);

    callback(actionUpdateMetadata);
    expect(SearchStore.results.length).toBe(0);

    callback(actionUpdateResults);
    expect(SearchStore.results.length).toBe(2);
    expect(SearchStore.results).toEqual([
      { id: 'xyz123', key: 'value1', url: '/search/result/xyz123', metadata: { imagename: 'placeholder.jpg', title: 'Kein Incipit vorhanden' } },
      { id: 'abc456', key: 'value2', url: '/search/result/abc456', metadata: { imagename: 'placeholder.jpg', title: 'Kein Incipit vorhanden' } }
    ]);

    callback(actionUpdateMetadata);
    expect(SearchStore.results).toEqual([
      { id: 'xyz123', key: 'value1', url: '/search/result/xyz123', metadata: { key1: 'value1', key2: 'value2', signature: 'xyz123' } },
      { id: 'abc456', key: 'value2', url: '/search/result/abc456', metadata: { imagename: 'placeholder.jpg', title: 'Kein Incipit vorhanden' } }
    ]);
  });

  it('should update results', () => {
    callback(actionUpdateResults);
    expect(SearchStore.results.length).toBe(2);
    expect(SearchStore.results).toEqual([
      { id: 'xyz123', key: 'value1', url: '/search/result/xyz123', metadata: { key1: 'value1', key2: 'value2', signature: 'xyz123' } },
      { id: 'abc456', key: 'value2', url: '/search/result/abc456', metadata: { imagename: 'placeholder.jpg', title: 'Kein Incipit vorhanden' } }
    ]);
  });

});