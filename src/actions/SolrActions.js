import AppDispatcher from '../dispatchers/AppDispatcher';
import { browserHistory } from 'react-router';
import { UPDATE_METADATA, UPDATE_FACETS, UPDATE_QUERY, UPDATE_RESULTS, UPDATE_RESULT_IMAGE } from '../constants/SolrConstants';

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
  
  updateQuery: (fields) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_QUERY,
      fields: fields
    });

    browserHistory.push('/search/result');
  },
  
  updateResults: (results, highlighting) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_RESULTS,
      results: results,
      highlighting: highlighting
    });
  },

  updateResultImage: (songsheet) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_RESULT_IMAGE,
      signature: songsheet.signature,
      image: songsheet.image,
    });
  }
}
