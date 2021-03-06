import AppDispatcher from '../dispatchers/AppDispatcher';
import {
  UPDATE_METADATA,
  UPDATE_FACETS,
  UPDATE_METADATA_QUERY,
  UPDATE_METADATA_RESULTS,
  UPDATE_SIMILAR_METADATA
} from '../constants/SolrConstants';

export default {

  updateMetadata: (response) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_METADATA,
      response: response
    });
  },

  updateFacets: (field, facets) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_FACETS,
      field: field,
      facets: facets
    });
  },
  
  updateQuery: (fields, query) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_METADATA_QUERY,
      fields: fields,
      query: query
    });
  },

  updateSimilarMetadata: (response) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_SIMILAR_METADATA,
      response: response
    });
  }
}
