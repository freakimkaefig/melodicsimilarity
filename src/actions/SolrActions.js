import AppDispatcher from '../dispatchers/AppDispatcher';
import { browserHistory } from 'react-router';
import { UPDATE_FACETS, UPDATE_QUERY, UPDATE_RESULTS } from '../constants/SolrConstants';

export default {
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
  }
}
