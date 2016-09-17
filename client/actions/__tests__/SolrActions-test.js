import {
  UPDATE_METADATA,
  UPDATE_FACETS,
  UPDATE_METADATA_QUERY,
  UPDATE_METADATA_RESULTS,
  UPDATE_SIMILAR_METADATA
} from '../../constants/SolrConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('SolrActions', () => {

  var AppDispatcher;
  var SolrActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    SolrActions = require('../SolrActions').default;
  });

  it('dispatches metadata update', () => {
    SolrActions.updateMetadata({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_METADATA,
      response: { key: 'value' }
    });
  });

  it('dispatches facets update', () => {
    SolrActions.updateFacets('field', ['facet1', 2, 'facet2', 1]);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_FACETS,
      field: 'field',
      facets: ['facet1', 2, 'facet2', 1]
    });
  });

  it('dispatches query update', () => {
    SolrActions.updateQuery([{key: 'field1'}, {key: 'field2'}], 'demo/query?q=test');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_METADATA_QUERY,
      fields: [{key: 'field1'}, {key: 'field2'}],
      query: 'demo/query?q=test'
    });
  });

  it('dispatches similar metadata update', () => {
    SolrActions.updateSimilarMetadata({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_SIMILAR_METADATA,
      response: { key: 'value' }
    });
  });

});