import AppDispatcher from '../dispatchers/AppDispatcher';
import {
  BEGIN_UPDATE_FIELD,
  UPDATE_FIELD
} from '../constants/SettingsConstants';

export default {
  beginUpdateField: (field) => {
    AppDispatcher.dispatch({
      actionType: BEGIN_UPDATE_FIELD,
      field: field
    });
  },

  updateField: (field) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_FIELD,
      type: field.type,
      field: field.key,
      value: field.value
    });
  }
}