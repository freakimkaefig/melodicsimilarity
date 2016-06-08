import AppDispatcher from '../dispatchers/AppDispatcher';
import { browserHistory } from 'react-router';
import {UPDATE_FIELD_VALUE, UPDATE_SEARCH_OPERATOR, UPDATE_SEARCH_START, START_SEARCH, UPDATE_RESULTS} from '../constants/SearchConstants';

export default {
  
  updateFieldValue(field, value) {
    AppDispatcher.dispatch({
      actionType: UPDATE_FIELD_VALUE,
      field: field,
      value: value
    });
  },
  
  updateOperator(value) {
    AppDispatcher.dispatch({
      actionType: UPDATE_SEARCH_OPERATOR,
      value: value
    });
  },
  
  updateStart(value) {
    AppDispatcher.dispatch({
      actionType: UPDATE_SEARCH_START,
      value: value
    });
  },
  
  startSearch() {
    AppDispatcher.dispatch({
      actionType: START_SEARCH
    });
  },

  updateResults(results) {
    AppDispatcher.dispatch({
      actionType: UPDATE_RESULTS,
      results: results
    });

    browserHistory.push('/search/result');
  }
}