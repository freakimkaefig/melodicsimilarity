import AppDispatcher from '../dispatchers/AppDispatcher';
import { SET_MUSIC_JSON } from '../constants/AbcConstants';

export default {
  setJsonString: (json) => {
    AppDispatcher.dispatch({
      actionType: SET_MUSIC_JSON,
      json: json
    });
  }
}