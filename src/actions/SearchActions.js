import AppDispatcher from '../dispatchers/AppDispatcher';
import {UPDATE_FIELD_VALUE, UPDATE_SEARCH_OPERATOR, UPDATE_SEARCH_START} from '../constants/SearchConstants';

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
  }
}