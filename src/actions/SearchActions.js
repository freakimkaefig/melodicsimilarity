import AppDispatcher from '../dispatchers/AppDispatcher';
import {UPDATE_FIELD_VALUE} from '../constants/SearchConstants';

export default {
  
  updateFieldValue(field, value) {
    AppDispatcher.dispatch({
      actionType: UPDATE_FIELD_VALUE,
      field: field,
      value: value
    });
  }
}